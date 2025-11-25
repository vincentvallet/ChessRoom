LOCAL PYTHON VERSION - FIDE DUTCH PAIRING
==========================================

This version includes the full Python FIDE Dutch pairing algorithm.

SETUP INSTRUCTIONS:
-------------------

1. Prerequisites:
   - Python 3.8 or higher
   - pip (Python package manager)

2. First-time setup:
   
   a) Create virtual environment:
      python3 -m venv venv
   
   b) Activate virtual environment:
      - macOS/Linux: source venv/bin/activate
      - Windows: venv\Scripts\activate
   
   c) Install dependencies:
      pip install -r requirements.txt

3. Running the application:
   
   ./start_server.sh
   
   Then open: http://localhost:8000/index.html

4. Stopping the server:
   
   Press Ctrl+C in the terminal

FEATURES AVAILABLE:
------------------
✅ Full FIDE Dutch pairing algorithm
✅ Round 1 pairings based on Elo rating
✅ Subsequent rounds respect Swiss rules
✅ Color balancing
✅ Upfloat/downfloat management
✅ All other features (QR codes, TRF export, etc.)

TROUBLESHOOTING:
---------------
If you get "command not found" errors:
  chmod +x start_server.sh

If Python dependencies fail to install:
  Make sure you have Python 3.8+ installed
  Try: python3 --version

For any issues:
  Check that the virtual environment is activated
  Look for error messages in the terminal
