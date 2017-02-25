angular.module('calculator', [])

.factory('InputsF', function(){
  return [
    {title: "Number of shares in grant", description: "The original number of shares given at the beginning of employment. "},
    {title: "Strike price", description: "The price at which you are able to sell your shares. "},
    {title: "Total number of outstanding shares in company", description: "If you have not been told this, it's important to ask."},
    {title: "Company Valuation", description: "The price at which the company could be purchased for. "}
  ]
})

.factory('SchedulesF', function(){
  return [
    [12, 30, 50, 100],
    [25, 50, 75, 100],
    [25, 50,100]
  ]
})

.factory('HelperFunctionsF', function(){
  return {
    grabInput: function(x){
      return document.getElementById(x).value;
    },
    addTemplate: function(){
      var fundingEvent = '$<input type = "text" id = "amount">raised on <br>$<input type = "text" id = "raisedOn">pre-money valuation<br>';
      document.getElementById('events').innerHTML += fundingEvent;
    },
    sharesVested: function(totalShares, exitYears,scheduleSelected){
      totalShares = parseInt(totalShares);
      exitYears = parseInt(exitYears);
      scheduleSelected = scheduleSelected.slice(1, -1);
      scheduleSelected = scheduleSelected.split(',');
      var ind = (parseInt(exitYears))-1;
      if (exitYears > scheduleSelected.length){ exitYears = scheduleSelected.length}
      var vest = parseInt(scheduleSelected[(parseInt(exitYears))-1]) || 0;
      return Math.floor(totalShares*(vest/100));
      },
      cost: function(shares, strikePrice){
        shares = parseInt(shares);
        return shares*strikePrice;
      },
      sharesValue: function(shares, exitVal, totalOShares){
        shares = parseInt(shares);
        return (shares/totalOShares)*exitVal;
      },
      checkInputs: function(arrOfNumbers){
        var error = false;
        for (var i = 0; i < arrOfNumbers.length; i=i+2){
          var item = parseInt(arrOfNumbers[i]);
          var itemID = arrOfNumbers[i+1];
          if (isNaN(item) || item === ''){
            //outline problem div in red
            document.getElementById(itemID).style.border = ".2em solid red";
            error = true;
          } else {
            //set css to normal around corresponding ID for reset purposes
            document.getElementById(itemID).style.border = "1px solid lightgrey";
          }
        } return error;
      }
  }
})

.controller('calculatorController', function($scope, InputsF, SchedulesF, HelperFunctionsF) {
  console.log("controller loaded");
  $scope.inputs = InputsF;
  $scope.schedules = SchedulesF;
  $scope.helpers = HelperFunctionsF;
  $scope.milestones = "Fundraising milestones are events such as securing series funding. These are important because they influence the overall valuation of a company as well as contribute to FD%."

  $scope.submit = function(){
    //collect input values
    var scheduleSelected = document.querySelector('input[name="schedule"]:checked').value;
    var exitYears = document.getElementById("exit").options[document.getElementById("exit").selectedIndex].value;
    var totalShares = $scope.helpers.grabInput("Number of shares in grant");
    var strikePrice = $scope.helpers.grabInput("Strike price");
    var exitVal = $scope.helpers.grabInput("exitValuation");
    var totalOShares = $scope.helpers.grabInput("Total number of outstanding shares in company");
    //if there are input errors hilight them and display error message
    if ($scope.helpers.checkInputs([totalShares, "Number of shares in grant", strikePrice, "Strike price", exitVal, "exitValuation", totalOShares, "Total number of outstanding shares in company"])){
      $scope.takeHome = "Error, please check highlighted inputs";
      } else {
        var shares = $scope.helpers.sharesVested(totalShares,exitYears, scheduleSelected);
        var sharesCost = $scope.helpers.cost(shares, strikePrice);
        var sharesValue = $scope.helpers.sharesValue(shares, exitVal, totalOShares);
        var result = (sharesValue-sharesCost).toFixed(2);
        if (result < 0){
          $scope.takeHome = "No profit";
        }
          $scope.takeHome = "$"+result;
        }
    }
})
