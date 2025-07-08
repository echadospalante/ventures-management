Feature: Create Venture

  Scenario: Create a new event fail
    Given I am a registered user, I want to create a new event
    When I fill in the event create fields
    And I click the Create Event button
    Then Since I am not the owner of the venture, so I cannot create an event, I should receive a 403 status code