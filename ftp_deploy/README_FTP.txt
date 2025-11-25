FILES FOR FTP DEPLOYMENT
========================

These files are ready for upload to your FTP server.

⚠️  IMPORTANT LIMITATIONS:
- The Python FIDE pairing algorithm will NOT work on FTP
- You must use manual pairings or the built-in JavaScript algorithms
- Save/load functions work only if your server supports PHP

To upload:
1. Upload all files and folders from this directory to your FTP root
2. Make sure save.php has write permissions (chmod 755)
3. Access via your domain URL

For local development with Python algorithm:
- Use the parent directory with ./start_server.sh
