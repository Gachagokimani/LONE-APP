#!/usr/bin/env python3
"""
Loan App - Cross-platform Development Server Runner
Runs both backend (Django) and frontend (Next.js) servers concurrently
Works on Windows, macOS, and Linux

Usage:
    python run-dev.py              # Run both servers
    python run-dev.py --backend    # Run backend only
    python run-dev.py --frontend   # Run frontend only
    python run-dev.py --test       # Run tests only
"""

import os
import sys
import subprocess
import time
import threading
import requests
from pathlib import Path
from typing import Optional

# Color output for terminal
class Colors:
    CYAN = '\033[36m'
    GREEN = '\033[32m'
    YELLOW = '\033[33m'
    RED = '\033[31m'
    RESET = '\033[0m'
    BOLD = '\033[1m'


def print_header(text: str) -> None:
    """Print colored header"""
    print(f"\n{Colors.CYAN}{Colors.BOLD}{'='*40}{Colors.RESET}")
    print(f"{Colors.CYAN}{Colors.BOLD}{text}{Colors.RESET}")
    print(f"{Colors.CYAN}{Colors.BOLD}{'='*40}{Colors.RESET}\n")


def print_success(text: str) -> None:
    """Print success message"""
    print(f"{Colors.GREEN}✓ {text}{Colors.RESET}")


def print_info(text: str) -> None:
    """Print info message"""
    print(f"{Colors.YELLOW}→ {text}{Colors.RESET}")


def print_error(text: str) -> None:
    """Print error message"""
    print(f"{Colors.RED}✗ {text}{Colors.RESET}")


class ServerRunner:
    """Manages running backend and frontend servers"""
    
    def __init__(self):
        self.root_dir = Path(__file__).parent
        self.backend_dir = self.root_dir / "backend"
        self.frontend_dir = self.root_dir / "frontend"
        self.backend_process: Optional[subprocess.Popen] = None
        self.frontend_process: Optional[subprocess.Popen] = None
        self.backend_ready = False
        self.frontend_ready = False
    
    def run_backend(self) -> None:
        """Start Django backend server"""
        print_info("Starting Backend Server...")
        
        try:
            os.chdir(self.backend_dir)
            
            # Run migrations
            print_info("Running migrations...")
            subprocess.run([sys.executable, "manage.py", "migrate"], check=True)
            
            print_success("Backend running on http://localhost:8000")
            print_success("API: http://localhost:8000/api/")
            print_success("Admin: http://localhost:8000/admin/")
            print()
            
            # Start server
            self.backend_process = subprocess.Popen(
                [sys.executable, "manage.py", "runserver", "0.0.0.0:8000"]
            )
            self.backend_process.wait()
        
        except Exception as e:
            print_error(f"Backend error: {e}")
        finally:
            os.chdir(self.root_dir)
    
    def run_frontend(self) -> None:
        """Start Next.js frontend server"""
        # Wait for backend to start
        time.sleep(3)
        
        print_info("Starting Frontend Server...")
        
        try:
            os.chdir(self.frontend_dir)
            
            print_success("Frontend running on http://localhost:3000")
            print()
            
            # Start server
            if sys.platform == "win32":
                self.frontend_process = subprocess.Popen(
                    ["npm", "run", "dev"],
                    shell=True
                )
            else:
                self.frontend_process = subprocess.Popen(
                    ["npm", "run", "dev"]
                )
            
            self.frontend_process.wait()
        
        except Exception as e:
            print_error(f"Frontend error: {e}")
        finally:
            os.chdir(self.root_dir)
    
    def test_servers(self) -> None:
        """Test if servers are running"""
        print_info("Testing servers...")
        time.sleep(2)
        
        # Test backend
        try:
            response = requests.get("http://localhost:8000/api/", timeout=2)
            if response.status_code == 200 or response.status_code == 401:
                print_success("Backend API is running")
                self.backend_ready = True
            else:
                print_error(f"Backend returned {response.status_code}")
        except Exception as e:
            print_error(f"Backend not available: {e}")
        
        # Test frontend
        try:
            response = requests.get("http://localhost:3000", timeout=2)
            if response.status_code == 200:
                print_success("Frontend is running")
                self.frontend_ready = True
            else:
                print_error(f"Frontend returned {response.status_code}")
        except Exception as e:
            print_error(f"Frontend not available: {e}")
        
        print()
    
    def run_both(self) -> None:
        """Run both servers concurrently"""
        print_header("Loan Application - Development Servers")
        
        # Run backend in thread
        backend_thread = threading.Thread(target=self.run_backend, daemon=True)
        backend_thread.start()
        
        # Run frontend in thread
        frontend_thread = threading.Thread(target=self.run_frontend, daemon=True)
        frontend_thread.start()
        
        # Test servers in main thread
        self.test_servers()
        
        print_header("Servers Running")
        print(f"{Colors.GREEN}Frontend:      http://localhost:3000{Colors.RESET}")
        print(f"{Colors.GREEN}Backend API:   http://localhost:8000/api/{Colors.RESET}")
        print(f"{Colors.GREEN}Django Admin:  http://localhost:8000/admin/{Colors.RESET}")
        print()
        print(f"{Colors.YELLOW}Press Ctrl+C to stop servers{Colors.RESET}\n")
        
        try:
            backend_thread.join()
            frontend_thread.join()
        except KeyboardInterrupt:
            print_info("Stopping servers...")
            if self.backend_process:
                self.backend_process.terminate()
            if self.frontend_process:
                self.frontend_process.terminate()
            print_success("Servers stopped")


def main():
    """Main entry point"""
    runner = ServerRunner()
    
    if len(sys.argv) > 1:
        arg = sys.argv[1].lower()
        
        if arg == "--backend":
            print_header("Backend Server Only")
            runner.run_backend()
        
        elif arg == "--frontend":
            print_header("Frontend Server Only")
            runner.run_frontend()
        
        elif arg == "--test":
            print_header("Testing Servers")
            runner.test_servers()
        
        elif arg in ["--help", "-h"]:
            print(__doc__)
        
        else:
            print_error(f"Unknown argument: {arg}")
            print(__doc__)
    
    else:
        runner.run_both()


if __name__ == "__main__":
    main()
