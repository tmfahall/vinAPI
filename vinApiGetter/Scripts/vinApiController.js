var x;

var app = angular.module('vinApiGetter', []);

app.controller('vinApiController', ['$scope', '$http', function ($scope, $http) {

    $scope.vehicle = [];

    $scope.getVinData = function () {

        vin = $scope.vinNum;
        year = $scope.yearNum;



        $http.get('https://vpic.nhtsa.dot.gov/api/vehicles/decodevinextended/' + vin + '?format=json&modelyear=' + year).then(function (response) {
            $scope.myData = response;

            dataArray = $scope.myData.data.Results;

            angular.forEach(dataArray, function (value, key) {

                if (value.Value === null) {

                }
                else {
                    value.isHere = true;
                    $scope.vehicle.push(value);
                }
            })
        })

    }

    $scope.addRow = function () {
        param = $scope.param;
        val = $scope.val;

        var newRow = { Value: val, Variable: param };
        $scope.param = null;
        $scope.val = null;

        $scope.vehicle.push(newRow)

    }

    $scope.editRow = function (num) {
        $scope.paramHolder = $scope.vehicle[num].Variable;
        $scope.valHolder = $scope.vehicle[num].Value;
        $scope.recordNum = num
    }

    $scope.saveChanges = function (num) {
        if ($scope.newVal == null) {
            $scope.vehicle[num].Value = $scope.valHolder;
        }
        else {
            $scope.vehicle[num].Value = $scope.newVal;
        }

        if ($scope.newParam == null) {
            $scope.vehicle[num].Variable = $scope.paramHolder;
        }
        else {
            $scope.vehicle[num].Variable = $scope.newParam;
        }
    }

    $scope.removeRow = function (num) {
        $scope.vehicle.splice(num, 1);
    }

    function handleFileSelect() {
        if (window.File && window.FileList && window.FileReader) {
            var files = event.target.files;
            var output = document.getElementById("result");

            for (var i = 0; i < files.length; i++) {
                var file = files[i];
                //Only pics
                if (!file.type.match('image')) continue;

                var picReader = new FileReader();
                picReader.addEventListener("load", function (event) {
                    var picFile = event.target;
                    var div = document.createElement("div");
                    div.innerHTML = "<img class='thumbnail' src='" + picFile.result + "'" + "title='" + picFile.name + "'/>";
                    output.insertBefore(div, null);
                });
                //Read the image
                picReader.readAsDataURL(file);
            }
        } else {
            console.log("Your browser does not support File API");
        }
    }

    document.getElementById('files').addEventListener('change', handleFileSelect, false);

}
])