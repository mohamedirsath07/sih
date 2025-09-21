import unittest
try:
    from app import create_app
except Exception:
    # Fallback when running from project root where package is backend.app
    from backend.app import create_app


class ExampleTestCase(unittest.TestCase):
    def setUp(self):
        self.app = create_app()
        self.app.config['TESTING'] = True
        self.client = self.app.test_client()

    def test_meta_endpoint(self):
        resp = self.client.get('/api/meta')
        self.assertEqual(resp.status_code, 200)
        data = resp.get_json()
        self.assertIn('service', data)
        self.assertIn('datasetVersion', data)

    def test_careers_endpoint(self):
        resp = self.client.get('/api/datasets/careers?stream=Science')
        self.assertEqual(resp.status_code, 200)
        careers = resp.get_json()
        self.assertIsInstance(careers, list)
        # Should return at least one career for seeded data
        self.assertGreater(len(careers), 0)

    def test_recommendations_quiz(self):
        payload = {
            'answers': [
                {'id': 1, 'choice': 'I enjoy math and lab work'},
                {'id': 2, 'choice': 'I like coding projects'}
            ]
        }
        resp = self.client.post('/api/recommendations/quiz', json=payload)
        self.assertEqual(resp.status_code, 200)
        data = resp.get_json()
        self.assertIn('recommended_stream', data)
        self.assertIn('top_colleges', data)
        self.assertIsInstance(data['top_colleges'], list)
        # if seeded data includes science, we should get results
        self.assertGreaterEqual(len(data['top_colleges']), 0)

    def test_colleges_filters(self):
        # Basic district filter
        r1 = self.client.get('/api/datasets/colleges?district=Jammu')
        self.assertEqual(r1.status_code, 200)
        cols1 = r1.get_json()
        self.assertTrue(all(((c.get('district') or c.get('location') or '').lower() == 'jammu') for c in cols1))

        # Stream filter should narrow to relevant institutions
        r2 = self.client.get('/api/datasets/colleges?stream=Science')
        self.assertEqual(r2.status_code, 200)
        cols2 = r2.get_json()
        self.assertIsInstance(cols2, list)

        # Degree substring filter
        r3 = self.client.get('/api/datasets/colleges?degree=B.Tech')
        self.assertEqual(r3.status_code, 200)
        cols3 = r3.get_json()
        self.assertTrue(all(any('b.tech' in (co or '').lower() for co in c.get('courses_offered', [])) for c in cols3))

    def test_scholarships_filters(self):
        # Text search
        r1 = self.client.get('/api/datasets/scholarships?q=STEM')
        self.assertEqual(r1.status_code, 200)
        data1 = r1.get_json()
        self.assertTrue(all('stem' in (f"{s.get('name','')} {s.get('details','')} {s.get('eligibility','')}".lower()) for s in data1))

        # Amount range
        r2 = self.client.get('/api/datasets/scholarships?minAmount=5000&maxAmount=7000')
        self.assertEqual(r2.status_code, 200)
        data2 = r2.get_json()
        self.assertTrue(all(5000 <= s.get('amount', 0) <= 7000 for s in data2))

        # Deadline before
        r3 = self.client.get('/api/datasets/scholarships?deadlineBefore=2023-07-01')
        self.assertEqual(r3.status_code, 200)
        data3 = r3.get_json()
        self.assertTrue(all((s.get('application_deadline') <= '2023-07-01') for s in data3))

    def test_timelines_list_and_next(self):
        # List admissions in Jammu
        r1 = self.client.get('/api/timelines?type=admission&district=Jammu')
        self.assertEqual(r1.status_code, 200)
        items = r1.get_json()
        self.assertTrue(all((it.get('type') == 'admission' and (it.get('district') or '').lower() == 'jammu') for it in items))

        # Next upcoming items should be sorted ascending by start_date
        r2 = self.client.get('/api/timelines/next?limit=3')
        self.assertEqual(r2.status_code, 200)
        nxt = r2.get_json()
        self.assertIsInstance(nxt, list)
        if len(nxt) >= 2:
            dates = [it.get('start_date') for it in nxt]
            self.assertEqual(dates, sorted(dates))

    def test_degrees_catalog(self):
        r = self.client.get('/api/datasets/degrees?stream=Science')
        self.assertEqual(r.status_code, 200)
        degrees = r.get_json()
        self.assertIsInstance(degrees, list)
        if degrees:
            self.assertIn('streams', degrees[0])

    def test_auth_lite_and_me(self):
        # Login
        r = self.client.post('/api/auth/login', json={'username': 'alice', 'district': 'Jammu'})
        self.assertEqual(r.status_code, 200)
        token = r.get_json().get('token')
        self.assertTrue(token)
        # Me
        r2 = self.client.get('/api/auth/me', headers={'Authorization': f'Bearer {token}'})
        self.assertEqual(r2.status_code, 200)
        me = r2.get_json()
        self.assertEqual(me.get('username'), 'alice')

    def test_sync_push_persists(self):
        events = [{"type": "profile_update", "payload": {"district": "Jammu"}}]
        r = self.client.post('/api/sync/push', json={'events': events})
        self.assertEqual(r.status_code, 202)
        data = r.get_json()
        self.assertEqual(data.get('accepted'), 1)


if __name__ == '__main__':
    unittest.main()