ReplaceString = """

This message contained an attachment that was stripped out.

The original type was: %(content_type)s
The filename was: %(filename)s,
(and it had additional parameters of:
%(params)s)

"""

import re
BAD_CONTENT_RE = re.compile('application/(msword|msexcel)', re.I)
#BAD_FILEEXT_RE = re.compile(r'(\.exe|\.zip|\.pif|\.scr|\.ps|\.png|\.jpg)$')
BAD_FILEEXT_RE = re.compile(r'(\.exe|\.zip|\.pif|\.scr|\.ps)$')

def sanitize(msg):
    # Strip out all payloads of a particular type
    ct = msg.get_content_type()
    print ct
    # We also want to check for bad filename extensions
    fn = msg.get_filename()
    # get_filename() returns None if there's no filename
    if BAD_CONTENT_RE.search(ct) or (fn and BAD_FILEEXT_RE.search(fn)):
        print "BAD FILE"
        # Ok. This part of the message is bad, and we're going to stomp
        # on it. First, though, we pull out the information we're about to
        # destroy so we can tell the user about it.

        # This returns the parameters to the content-type. The first entry
        # is the content-type itself, which we already have.
        params = msg.get_params()[1:]
        # The parameters are a list of (key, value) pairs - join the
        # key-value with '=', and the parameter list with ', '
        params = ', '.join([ '='.join(p) for p in params ])
        # Format up the replacement text, telling the user we ate their
        # email attachment.
        replace = ReplaceString % dict(content_type=ct,
                                       filename=fn,
                                       params=params)
        # Install the text body as the new payload.
        msg.set_payload(replace)
        # Now we manually strip away any paramaters to the content-type
        # header. Again, we skip the first parameter, as it's the
        # content-type itself, and we'll stomp that next.
        for k, v in msg.get_params()[1:]:
            msg.del_param(k)
        # And set the content-type appropriately.
        msg.set_type('text/plain')
        # Since we've just stomped the content-type, we also kill these
        # headers - they make no sense otherwise.
        del msg['Content-Transfer-Encoding']
        del msg['Content-Disposition']
    else:
        # Now we check for any sub-parts to the message
        if msg.is_multipart():
            # Call the sanitise routine on any subparts
            payload = [ sanitize(x) for x in msg.get_payload() ]
            # We replace the payload with our list of sanitised parts
            msg.set_payload(payload)
    # Return the sanitised message
    return msg

def extract_body(msg):
    body, rich_body = '', ''
    charset = None
    for part in msg.walk():
        #if part.is_multipart():
        #    for subpart in part.walk():
        #        if subpart.get_content_type() == 'text/plain':
        #            continue
        if part.get_content_type() == 'text/plain' and not part.is_multipart():
            text = part.get_payload(decode=True)
            charset = get_charset(part)
            body += text.decode(charset, 'ignore')
        elif part.get_content_type() == 'text/html' and not part.is_multipart():
            text = part.get_payload(decode=True)
            charset = get_charset(part)
            rich_body += text.decode(charset, 'ignore')

    if rich_body == '':
        return body
    else:
        return rich_body

def get_charset(msg, default="ascii"):
    if msg.get_content_charset():
        return msg.get_content_charset()
    elif msg.get_charset():
        return msg.get_charset()

    return default