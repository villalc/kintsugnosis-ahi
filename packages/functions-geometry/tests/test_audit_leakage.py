import sys
import os
import unittest
from unittest.mock import MagicMock, patch

# 1. Mock dependencies BEFORE importing main
mock_ff = MagicMock()
def http_decorator(func):
    return func
mock_ff.http = http_decorator
sys.modules["functions_framework"] = mock_ff
sys.modules["firebase_admin"] = MagicMock()
sys.modules["google.cloud"] = MagicMock()
sys.modules["google.cloud.storage"] = MagicMock()
sys.modules["numpy"] = MagicMock()
sys.modules["torch"] = MagicMock()

# Mock core modules that might not exist in the environment
sys.modules["core"] = MagicMock()
sys.modules["core.geometry"] = MagicMock()
sys.modules["core.geometry.models"] = MagicMock()
sys.modules["core.geometry.models.syntergic_model"] = MagicMock()
sys.modules["core.geometry.physics"] = MagicMock()
sys.modules["core.geometry.physics.metrics"] = MagicMock()


# 2. Add parent directory to path to import main
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

# 3. Import the function to test
from main import audit_ricci

class TestSentinelVulnerability(unittest.TestCase):
    def setUp(self):
        self.mock_request = MagicMock()
        self.mock_request.method = 'POST'
        self.mock_request.headers = {}
        # Reset globals if needed, though they are imported
        import main
        main.active_model = None

    @patch('main.verify_app_check')
    @patch('main.verify_server_auth')
    def test_info_leak_on_inference_error(self, mock_auth, mock_check):
        # Bypass auth
        mock_check.return_value = True
        mock_auth.return_value = False

        # Setup request to trigger inference path
        # We need data list > 0
        self.mock_request.get_json.return_value = {"data": [1.0, 2.0]}

        # We need to make the inference block fail with a specific sensitive message
        # In main.py:
        # from core.geometry.models.syntergic_model import SintergicGaugeNet
        # active_model = SintergicGaugeNet(...)

        sensitive_error = "SENSITIVE_PATH:/usr/local/secret/weights.pth"

        # We can patch the class constructor to raise an exception
        with patch('core.geometry.models.syntergic_model.SintergicGaugeNet', side_effect=Exception(sensitive_error)):
             response = audit_ricci(self.mock_request)

             body, status, headers = response

             # Verify FIX: The sensitive error string is NOT returned in the body
             self.assertNotIn(sensitive_error, str(body), "FIX VERIFIED: Sensitive info not leaked")
             self.assertIn("Internal Processing Error", str(body), "Generic error message returned")
             self.assertEqual(status, 500)

if __name__ == '__main__':
    unittest.main()
