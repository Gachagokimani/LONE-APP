#!/usr/bin/env python
"""
Workaround script to run Django management commands with a patched environment
to handle the pkg_resources issue in Python 3.14
"""
import sys
import importlib.metadata as metadata

# Create a mock pkg_resources module if it doesn't exist
class MockPkgResources:
    @staticmethod
    def get_distribution(name):
        try:
            return metadata.distribution(name)
        except metadata.PackageNotFoundError:
            raise ImportError(f"Package {name} not found")
    
    DistributionNotFound = metadata.PackageNotFoundError

# Inject mock pkg_resources before importing Django
sys.modules['pkg_resources'] = MockPkgResources()

# Now run Django
os_module = __import__('os')
os_module.environ.setdefault("DJANGO_SETTINGS_MODULE", "config.settings")

try:
    from django.core.management import execute_from_command_line
except ImportError as exc:
    msg = (
        "Couldn't import Django. Are you sure it's installed and "
        "available on your PYTHONPATH environment variable? Did you "
        "forget to activate a virtual environment?"
    )
    raise ImportError(msg) from exc

if __name__ == '__main__':
    execute_from_command_line(sys.argv)
