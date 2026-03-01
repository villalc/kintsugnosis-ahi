# tests/domain/test_telemetry.py

import unittest
from malbolge_core.telemetry import TelemetryProvider, RICCI_BASELINE, RICCI_THRESHOLD_STABLE

class TestTelemetryProvider(unittest.TestCase):
    def setUp(self):
        self.provider = TelemetryProvider(history_limit=10)

    def test_current_ricci_precision(self):
        """Test precision >= 0.001 and range constraints"""
        val = self.provider.current_ricci()
        self.assertIsInstance(val, float)
        self.assertGreaterEqual(val, 0.1)
        self.assertLessEqual(val, 2.0)
        # Check precision implied by string representation or rounding
        self.assertEqual(val, round(val, 3))

    def test_history_limit(self):
        """Test history constraint"""
        for _ in range(15):
            self.provider.current_ricci()
        
        history = self.provider.ricci_history(last_n=100)
        self.assertEqual(len(history), 10) # Limited by constructor to 10

    def test_history_retrieval(self):
        """Test retrieving subset of history"""
        for i in range(5):
            self.provider.current_ricci()
            
        history = self.provider.ricci_history(last_n=2)
        self.assertEqual(len(history), 2)

    def test_health_status(self):
        """Test status logic"""
        # Force stable
        self.provider._last_value = RICCI_BASELINE
        self.assertEqual(self.provider.health_status(), "STABLE")
        
        # Force unstable
        self.provider._last_value = RICCI_THRESHOLD_STABLE + 0.1
        self.assertEqual(self.provider.health_status(), "UNSTABLE")

if __name__ == '__main__':
    unittest.main()
