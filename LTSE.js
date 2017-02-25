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
    sharesVested: function(totalShares, exitYears){
      totalShares = parseInt(totalShares);
      exitYears = parseInt(exitYears);
      var scheduleSelected = document.querySelector('input[name="schedule"]:checked').value;
      scheduleSelected = scheduleSelected.slice(1, -1);
      scheduleSelected = scheduleSelected.split(',');
      var ind = (parseInt(exitYears))-1;
      if (exitYears > scheduleSelected.length){ exitYears = scheduleSelected.length}
      var vest = parseInt(scheduleSelected[(parseInt(exitYears))-1]) || 0;
      return Math.floor(totalShares*(vest/100));
      },
      cost: function(shares){
        shares = parseInt(shares);
        strikePrice = document.getElementById("Strike price").value;
        return shares*strikePrice;
      },
      sharesValue: function(shares){
        shares = parseInt(shares);
        exitVal = document.getElementById("exitValuation").value;
        totalShares = document.getElementById("Total number of outstanding shares in company").value;
        return (shares/totalShares)*exitVal;
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
    var totalShares = document.getElementById("Number of shares in grant").value;
    var exitYears = document.getElementById("exit").options[document.getElementById("exit").selectedIndex].value;
    var shares = $scope.helpers.sharesVested(totalShares,exitYears);
    var sharesCost = $scope.helpers.cost(shares);
    var sharesValue = $scope.helpers.sharesValue(shares);
    var result = (sharesValue-sharesCost).toFixed(2);

    if (result < 0){
      $scope.takeHome = "No profit";
    } else if (!result){
      $scope.takeHome = "Error, please check inputs";
    }else {
      $scope.takeHome = "$"+result;
    }
  }

})
