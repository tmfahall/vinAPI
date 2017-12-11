var x;

var app = angular.module('vinApiGetter', []);

app.controller('vinApiController', ['$scope', '$http', function ($scope, $http) {

    $scope.vehicle = [];
    var pix = [];
    var z = true;

    $scope.getVinData = function () {

        vin = $scope.vinNum;
        year = $scope.yearNum;
        price = $scope.price;
        $scope.vehicleMake = false;
        $scope.vehicleModel = false;
        $scope.vehicleYear = false;
        $scope.vehicleType = false;



        $http.get('https://vpic.nhtsa.dot.gov/api/vehicles/decodevinextended/' + vin + '?format=json&modelyear=' + year).then(function (response) {
            $scope.myData = response;

            dataArray = $scope.myData.data.Results;

            angular.forEach(dataArray, function (value, key) {
            
                if (value.Variable == "Make") {
                    $scope.vehicleMake = value.Value;
                }

                if (value.Variable == "Model") {
                    $scope.vehicleModel = value.Value;
                }

                if (value.Variable == "Model Year") {
                    $scope.vehicleYear = value.Value;
                }

                if (value.Variable == "Vehicle Type") {
                    $scope.vehicleType = value.Value;
                }

                if (value.Value === null || value.Value == "" || value.Variable == "Error Code" || value.Variable == "Manufacturer Name" || value.Variable == "Plant City" || value.Variable == "Plant Country" || value.Variable == "Plant State" || value.Variable == "Manufacturer Id" || value.Variable == "Body Class" || value.Variable == "Cab Type" || value.Variable == "Displacement (CC)" || value.Variable == "Displacement(CI)" || value.Variable == "NCSA Make" || value.Variable == "NCSA Model" || value.Variable == "NCSA Body Type") {

                }
                else {
                    value.isHere = true;
                    $scope.vehicle.push(value);
                }
            })

            x = $scope.vehicle;

            if ($scope.vehicleMake === false) {
                $scope.vehicleMake = "";
                $scope.vehicle.push({
                    Variable: "Make"
                })
            }

            if ($scope.vehicleModel === false) {
                $scope.vehicleModel = "";
                $scope.vehicle.push({
                    Variable: "Model"
                })
            }

            if ($scope.vehicleYear === false) {
                $scope.vehicleYear = "";
                $scope.vehicle.push({
                    Variable: "Year", Value: year
                })
            }

            if ($scope.vehicleType === false) {
                $scope.vehicleType = "";
                $scope.vehicle.push({
                    Variable: "Vehicle Type"
                })
            }

            if ($scope.vehiclePrice === false) {
                $scope.vehiclePrice = price;
                $scope.vehicle.push({
                    Variable: "Price",
                    Value: price
                })
            }

            console.log("vehiclePrice = " + $scope.vehiclePrice);
            console.log("price = " + price);
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

    $scope.preview = function () {
        var tempArry = [];

        $scope.vehicle.forEach(function (value, key) {
            tempArry.push(value.Value);
        })

        var holder = tempArry.join("; ");

        return holder;
    }

    x = $scope.vehicle;

    function handleFileSelect() {
        if (window.File && window.FileList && window.FileReader) {
            var files = event.target.files;

            for (var i = 0; i < files.length; i++) {
                var file = files[i];
                //Only pics
                if (!file.type.match('image')) continue;

                var picReader = new FileReader();
                picReader.addEventListener("load", function (event) {

                    var picFile = event.target;

                    //have array of images so that i can remove comments 1 and 2 below and turn them to angular
                    pix.push(picFile.result);

                    //#1
                    jQuery("#result").append("<img style='width: 10vw;margin:1vw' src='" + picFile.result + "'" + "title='" + picFile.name + "'/><label for='removePic" + i + "'><input type='checkbox' class='clickToRemovePic' id='removePic" + i + "'/>Remove?</label>");

                    //#2
                    if (z == true) {
                        jQuery("#previewImage").append("<img style='width: 10vw;margin:1vw' src='" + picFile.result + "'" + "title='" + picFile.name + "'/>");

                        //push primary pic to vehicle JSON
                        $scope.vehicle.push({
                            PrimaryImage: picFile.result
                        })

                        z = false;
                    }

                });

                //Read the image
                picReader.readAsDataURL(file);

            }
        } else {
            console.log("Your browser does not support File API");
        }
        //push pictures to vehicle JSON
        $scope.vehicle.push(pix);

    }

    document.getElementById('files').addEventListener('change', handleFileSelect, false);

}])