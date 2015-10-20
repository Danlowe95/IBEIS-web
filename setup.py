from subprocess import call
import argparse

parser = argparse.ArgumentParser(description='Setup script for WIBEIS')

parser.add_argument('--depend', dest="depend", action="store_true", default=False, help='install dependencies')
parser.add_argument('--upgrade', dest="upgrade", action="store_true", default=False, help='upgrade dependencies')
parser.add_argument('--pull', dest="pull", action="store_true", default=False, help='pull and install the latest version')

args = parser.parse_args()
print args

if args.depend:
	call("sudo apt-get install nodejs".split(" "))
	call("sudo apt-get install nodejs-legacy".split(" "))
	call("sudo apt-get install npm".split(" "))
	call("sudo npm install -g nodemon".split(" "))
	call("sudo npm install -g bower".split(" "))

if args.upgrade:
	call("sudo apt-get install nodejs".split(" "))
	call("sudo apt-get install nodejs-legacy".split(" "))
	# call("sudo npm install -g npm --upgrade".split(" "))
	call("sudo npm install -g nodemon --upgrade".split(" "))
	call("sudo npm install -g bower --upgrade".split(" "))
