Feature: Refresh Auth

  Scenario:  Refresh authentication token with valid credentials
    Given I am a registered user and I have an active session
    When I refresh my authentication token
    Then  I should get a 200 status code, and a new authentication token