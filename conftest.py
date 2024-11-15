import sys
from pathlib import Path

project_root = Path(__file__).parent.absolute()

sys.path.insert(0, str(project_root))


def pytest_configure():
    """
    Called before pytest collects any tests
    """
    print(f"Project root: {project_root}")
    print(f"sys.path: {sys.path}")
