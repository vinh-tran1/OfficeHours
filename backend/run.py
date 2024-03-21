"""
program: runserver.py
description: runs flask app
"""
import sys
import os
from app import app

def main():
    """ main function to start flask app
    """
    port = int(os.getenv('PORT', 80))

    try:
        app.run(host='0.0.0.0', port=port, debug=True)
        
    except Exception as ex:
        print(ex, file=sys.stderr)
        sys.exit(1)

if __name__ == '__main__':
    main()
