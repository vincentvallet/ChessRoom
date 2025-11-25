import http.server
import socketserver
import json
import sys
import os
import traceback

# Add Chess-main to path so we can import the interface
sys.path.append(os.path.join(os.path.dirname(__file__), 'Chess-main'))

# Import the processing logic from our interface script
try:
    from interface import process_input
    from Niveaux import Appariement, attributions_couleurs
except ImportError as e:
    print(f"Error importing pairing modules: {e}")
    print("Make sure you are running this from the root directory and dependencies are installed.")

PORT = 8000

class ChessHandler(http.server.SimpleHTTPRequestHandler):
    def do_POST(self):
        # Handle the pairing request
        if self.path.endswith('pairing.php'):
            content_length = int(self.headers['Content-Length'])
            post_data = self.rfile.read(content_length)
            
            try:
                data = json.loads(post_data.decode('utf-8'))
                
                # Run the pairing logic
                # 1. Process input
                Liste_Indices, Liste_Finale, Liste_Niveaux, Mrencontres, Mcouleurs, Mflotteurs, Mscores, Nronde, Nrondemax = process_input(data)
                
                # 2. Run Algorithm
                TableauAppariement = Appariement(Liste_Indices, Liste_Finale, Liste_Niveaux, Mrencontres, Mcouleurs, Mflotteurs, Mscores, Nronde, Nrondemax)
                
                # 3. Attribute Colors
                TableauAppariement = attributions_couleurs(TableauAppariement, Mcouleurs, Liste_Finale)
                
                # 4. Format Output
                pairings = []
                for index, row in TableauAppariement.iterrows():
                    white_id = row['NA Blancs']
                    black_id = row['NA Noirs']
                    
                    if white_id == 'EXEMPT':
                        pairings.append({'white': None, 'black': int(black_id)})
                    elif black_id == 'EXEMPT':
                        pairings.append({'white': int(white_id), 'black': None})
                    else:
                        pairings.append({'white': int(white_id), 'black': int(black_id)})
                
                response = {'status': 'success', 'pairings': pairings}
                
                # Send response
                self.send_response(200)
                self.send_header('Content-type', 'application/json')
                self.send_header('Access-Control-Allow-Origin', '*') # CORS
                self.end_headers()
                self.wfile.write(json.dumps(response).encode('utf-8'))
                
            except Exception as e:
                traceback.print_exc()
                self.send_response(500)
                self.send_header('Content-type', 'application/json')
                self.end_headers()
                self.wfile.write(json.dumps({'status': 'error', 'message': str(e)}).encode('utf-8'))
        
        elif self.path.endswith('save.php') or self.path.endswith('update_score.php'):
            # Stub for save.php and update_score.php - just return success
            # The app uses localStorage primarily, so we can ignore server saves for now
            content_length = int(self.headers.get('Content-Length', 0))
            if content_length > 0:
                post_data = self.rfile.read(content_length)
            
            self.send_response(200)
            self.send_header('Content-type', 'application/json')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()
            self.wfile.write(json.dumps({'success': True, 'message': 'Saved (stub)'}).encode('utf-8'))
                
        else:
            # Default behavior for other POST requests (if any)
            self.send_error(404, "File not found")

    def end_headers(self):
        # Add no-cache headers before ending headers
        self.send_header("Cache-Control", "no-cache, no-store, must-revalidate")
        self.send_header("Pragma", "no-cache")
        self.send_header("Expires", "0")
        # Add timestamp to force cache invalidation
        import time
        self.send_header("ETag", f'"{time.time()}"')
        super().end_headers()

print(f"Starting server at http://localhost:{PORT}")
print(f"Open http://localhost:{PORT}/pairing/fide_pairing.html to use the app.")

# Allow address reuse to avoid 'Address already in use' errors
socketserver.TCPServer.allow_reuse_address = True

with socketserver.TCPServer(("", PORT), ChessHandler) as httpd:
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\nServer stopped.")
