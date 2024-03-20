"""
program: runserver.py
description: runs flask app
"""

import argparse
import sys
from app import app

def get_port():
    """ parse the command line arguments for port
        store argument as variable
    """
    
    parser = argparse.ArgumentParser()
    parser.add_argument('port', metavar='port', type=int,
                    help='the port at which the server should listen')

    args = parser.parse_args()
    port =  args.port

    return port

def main():
    """ main function to start flask app
    """

    port = get_port()

    try:
        app.run(host='0.0.0.0', port=port, debug=True)
        
    except Exception as ex:
        print(ex, file=sys.stderr)
        sys.exit(1)

if __name__ == '__main__':
    main()
