import unittest
from django.test import Client
import json

class SimpleTest(unittest.TestCase):
    def setUp(self):
        # Every test needs a client.
        self.client = Client()

    def test_login(self):
        response = self.client.post('https://swt-projekt.herokuapp.com/login/', {'username': 'admin', 'password': 'root'})

        # Check that the response is 200 OK.
        self.assertEqual(response.status_code, 200)


    def test_kanzi_default_config(self):
        loginResponse = self.client.post('https://swt-projekt.herokuapp.com/login/', {'username': 'admin', 'password': 'root'})
        token = json.loads(loginResponse.content).get('token')
        
        params = {'method-name': 'kanzi.Global$1.compare'}
        response = self.client.get('https://swt-projekt.herokuapp.com/config/kanzi/default/', 
                                    params, HTTP_AUTHORIZATION='Token ' + token)

        # Check that the response is 200 OK.
        self.assertEqual(response.status_code, 200)


    def test_density_default_config(self):
        loginResponse = self.client.post('/login/', {'username': 'admin', 'password': 'root'})
        token = json.loads(loginResponse.content).get('token')
        
        params = {'method-name': 'at.favre.tools.dconvert.DConvert$1$1.onFinished'}
        response = self.client.get('https://swt-projekt.herokuapp.com/config/density/default/', 
                                    params, HTTP_AUTHORIZATION='Token ' + token)

        # Check that the response is 200 OK.
        self.assertEqual(response.status_code, 200)


    def test_kanzi_one_config(self):
        loginResponse = self.client.post('https://swt-projekt.herokuapp.com/login/', {'username': 'admin', 'password': 'root'})
        token = json.loads(loginResponse.content).get('token')
        
        params = {'method-name': 'kanzi.Global$1.compare', 'root': 1}
        response = self.client.get('https://swt-projekt.herokuapp.com/config/kanzi/one/', 
                                    params, HTTP_AUTHORIZATION='Token ' + token)

        # Check that the response is 200 OK.
        self.assertEqual(response.status_code, 200)


    def test_kanzi_one_method_two_configs(self):
        loginResponse = self.client.post('https://swt-projekt.herokuapp.com/login/', {'username': 'admin', 'password': 'root'})
        token = json.loads(loginResponse.content).get('token')
        
        params1 = {'method-name': 'kanzi.Global$1.compare', 'root': 1}
        params2 = {'method-name': 'kanzi.Global$1.compare', 'root': 1, 'LEVEL': 1}
        response1 = self.client.get('https://swt-projekt.herokuapp.com/config/kanzi/one/', 
                                    params1, HTTP_AUTHORIZATION='Token ' + token)
        response2 = self.client.get('https://swt-projekt.herokuapp.com/config/kanzi/one/', 
                                    params2, HTTP_AUTHORIZATION='Token ' + token)

        # Check that you get different resaults for different configs.
        self.assertNotEqual(response1.data.get('energy'), response2.data.get('energy'))
        self.assertNotEqual(response1.data.get('run-time'), response2.data.get('run-time'))


    def test_density_one_method_two_configs(self):
        loginResponse = self.client.post('https://swt-projekt.herokuapp.com/login/', {'username': 'admin', 'password': 'root'})
        token = json.loads(loginResponse.content).get('token')
        
        params1 = {'method-name': 'at.favre.tools.dconvert.DConvert$1$1.onFinished', 'root': 1}
        params2 = {'method-name': 'at.favre.tools.dconvert.DConvert$1$1.onFinished', 'root': 1, 'Scale': 1}
        response1 = self.client.get('https://swt-projekt.herokuapp.com/config/density/one/', 
                                    params1, HTTP_AUTHORIZATION='Token ' + token)
        response2 = self.client.get('https://swt-projekt.herokuapp.com/config/density/one/', 
                                    params2, HTTP_AUTHORIZATION='Token ' + token)

        # Check that you get different resaults for different configs.
        self.assertNotEqual(response1.data.get('energy'), response2.data.get('energy'))
        self.assertNotEqual(response1.data.get('run-time'), response2.data.get('run-time'))


    def test_density_one_config(self):
        loginResponse = self.client.post('https://swt-projekt.herokuapp.com/login/', {'username': 'admin', 'password': 'root'})
        token = json.loads(loginResponse.content).get('token')
        
        params = {'method-name': 'at.favre.tools.dconvert.DConvert$1$1.onFinished', 'root': 1}
        response = self.client.get('https://swt-projekt.herokuapp.com/config/density/one/',
                                    params, HTTP_AUTHORIZATION='Token ' + token)

        # Check that the response is 200 OK.
        self.assertEqual(response.status_code, 200)


    def test_kanzi_many_config(self):
        loginResponse = self.client.post('https://swt-projekt.herokuapp.com/login/', {'username': 'admin', 'password': 'root'})
        token = json.loads(loginResponse.content).get('token')
        
        params = {'method-name': 'kanzi.Global$1.compare,test', 'root': 1}
        response = self.client.get('https://swt-projekt.herokuapp.com/config/kanzi/many/', 
                                    params, HTTP_AUTHORIZATION='Token ' + token)

        # Check that the response is 200 OK.
        self.assertEqual(response.status_code, 200)

    
    def test_density_many_config(self):
        loginResponse = self.client.post('https://swt-projekt.herokuapp.com/login/', {'username': 'admin', 'password': 'root'})
        token = json.loads(loginResponse.content).get('token')
        
        params = {'method-name': 'at.favre.tools.dconvert.DConvert$1$1.onFinished,test', 'root': 1}
        response = self.client.get('https://swt-projekt.herokuapp.com/config/density/many/',
                                    params, HTTP_AUTHORIZATION='Token ' + token)

        # Check that the response is 200 OK.
        self.assertEqual(response.status_code, 200)