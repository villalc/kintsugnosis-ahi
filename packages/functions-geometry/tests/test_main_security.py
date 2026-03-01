import sys
import os
import unittest
from unittest.mock import MagicMock, patch

# 1. Mock dependencies BEFORE importing main
mock_ff = MagicMock()
# Create a pass-through decorator for @functions_framework.http
def http_decorator(func):
    return func
mock_ff.http = http_decorator
sys.modules["functions_framework"] = mock_ff

sys.modules["firebase_admin"] = MagicMock()
sys.modules["google.cloud"] = MagicMock()
sys.modules["google.cloud.storage"] = MagicMock()
sys.modules["numpy"] = MagicMock()
sys.modules["torch"] = MagicMock()

# 2. Add parent directory to path to import main
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

# 3. Import the function to test
from main import audit_ricci

class TestAuditSecurity(unittest.TestCase):
    def setUp(self):
        self.mock_request = MagicMock()
        self.mock_request.method = 'POST'
        self.mock_request.headers = {}

    @patch('main.verify_app_check')
    def test_exception_leakage(self, mock_verify):
        # Bypass App Check
        mock_verify.return_value = True

        # Simulate an exception during processing
        # We assume request.get_json triggers it or later code
        # Since we mocked numpy, code usage of np.var might work or not depending on mock
        # But here we force an exception early via get_json to test the outer try/except
        self.mock_request.get_json.side_effect = Exception("SENSITIVE_DB_CONNECTION_STRING_LEAK")

        # Call the function
        response = audit_ricci(self.mock_request)

        # Unpack response (body, status, headers)
        body, status, headers = response

        # Assertions
        self.assertEqual(status, 500)

        # Current behavior: returns "Internal Error: SENSITIVE_DB_CONNECTION_STRING_LEAK"
        # We assert what we WANT (secure behavior)
        if "SENSITIVE" in str(body):
             self.fail(f"VULNERABILITY CONFIRMED: Response contained sensitive info: {body}")

        self.assertNotIn("SENSITIVE_DB_CONNECTION_STRING_LEAK", str(body))
        self.assertIn("Internal Sintergy Error", str(body))

    @patch('main.verify_app_check')
    def test_large_payload_dos(self, mock_verify):
        # Bypass App Check
        mock_verify.return_value = True

        # Create a large payload
        large_data = [0.1] * 2000 # 2000 items

        # Setup mocks to return this data
        self.mock_request.get_json.return_value = {"action": "INFERENCE", "data": large_data}
        self.mock_request.get_json.side_effect = None

        # Call the function
        response = audit_ricci(self.mock_request)

        # Unpack response
        body, status, headers = response

        # Current behavior: 200 OK (mocked numpy does nothing)
        # We assert what we WANT (blocking)
        if status == 200:
             self.fail("VULNERABILITY CONFIRMED: Large payload was processed instead of blocked.")

        self.assertEqual(status, 400)
        self.assertIn("Payload too large", str(body))
