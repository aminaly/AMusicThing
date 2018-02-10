 #!/usr/bin/python
 # -*- coding: UTF-8 -*-

import cgi
import sys
import json

def output(content):
    sys.stdout.write('Content-Type: text/plain\n\n')
    sys.stdout.write(content)

form = cgi.FieldStorage()
data = str(form['myData'].value)
output(data)

#pyObject = json.loads(data)

#ret = json.dumps(pyObject['audio_features'][0])


#output('I came from Python! ' + ret)
#raise SystemExit
