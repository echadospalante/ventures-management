Feature: Create Venture

  Scenario: Create a new venture
    Given I am user active and allowed to create ventures
    And I am on the "Create Venture" page
    When I fill in the venture create fields
    And I click the "Create Venture" button
    Then I should receive a 201 status code