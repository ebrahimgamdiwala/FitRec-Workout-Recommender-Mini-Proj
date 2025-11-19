import os
import json
from datetime import datetime

class Tracker:
    """Simple JSON-backed tracker for user workout plans."""
    def __init__(self, storage_path=None):
        base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
        self.storage_path = storage_path or os.path.join(base_dir, 'models', 'tracking.json')
        os.makedirs(os.path.dirname(self.storage_path), exist_ok=True)
        if not os.path.exists(self.storage_path):
            with open(self.storage_path, 'w') as f:
                json.dump({}, f)

    def _read(self):
        with open(self.storage_path, 'r') as f:
            return json.load(f)

    def _write(self, data):
        with open(self.storage_path, 'w') as f:
            json.dump(data, f, indent=2, default=str)

    def start_tracking(self, user_id, plan_title):
        """Create an entry and start tracking for a user-plan pair"""
        data = self._read()
        if user_id not in data:
            data[user_id] = []
        # Check if already tracking this plan
        for p in data[user_id]:
            if p['title'] == plan_title:
                return p

        entry = {
            'title': plan_title,
            'created_at': datetime.now().isoformat(),
            'progress': [],  # time-series of progress updates
            'current_progress': 0
        }
        data[user_id].append(entry)
        self._write(data)
        return entry

    def update_progress(self, user_id, plan_title, progress_value, note=None):
        """Update progress for a given plan and user

        progress_value should be a number 0-100 representing percent complete
        """
        data = self._read()
        if user_id not in data:
            raise ValueError('User not found')
        for p in data[user_id]:
            if p['title'] == plan_title:
                now = datetime.now().isoformat()
                p['progress'].append({'date': now, 'value': progress_value, 'note': note or ''})
                p['current_progress'] = progress_value
                self._write(data)
                return p
        raise ValueError('Plan not found for user')

    def get_tracking(self, user_id):
        data = self._read()
        return data.get(user_id, [])
