#!/usr/bin/env python3
import sys
import pytest

def run_all_tests():
    print("=" * 60)
    print("Running All Backend Tests")
    print("=" * 60)
    
    args = [
        "tests/",
        "-v",
        "--tb=short",
        "--color=yes"
    ]
    
    exit_code = pytest.main(args)
    
    print("\n" + "=" * 60)
    if exit_code == 0:
        print("All tests passed successfully!")
    else:
        print(f"Tests failed with exit code: {exit_code}")
    print("=" * 60)
    
    return exit_code

if __name__ == "__main__":
    sys.exit(run_all_tests())
