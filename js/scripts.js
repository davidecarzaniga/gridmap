angular.module("app", []).config(function($routeProvider) {
    $routeProvider.
        when('/', {templateUrl:'menu_main.html'}).
        when('/settings', {templateUrl:'settings.html', controller:'editSettings'}).
        when('/creature', {templateUrl:'new_creature.html', controller:'newCreature'}).
        when('/creature/edit/:id', {templateUrl:'new_creature.html', controller:'editCreature'}).
        when('/area', {templateUrl:'new_area.html', controller:'newArea'}).
        when('/area/edit/:id', {templateUrl:'new_area.html', controller:'editArea'}).
        otherwise({redirectTo:'/'});
}).filter('range', function() {
  return function(input, total) {
    total = parseInt(total);
    for (var i=0; i<total; i++)
      input.push(i);
    return input;
  };
}).directive('myDraggable', function($document) {
    return function(scope, element, attr) {
        //var options = scope.$eval(attrs.myDraggable); //allow options to be passed in
        
        options = {
            containment: '#grid-container',
            snap: '.grid-item',
            opacity: 0.7,
            helper: 'clone',
            stop: function(event, ui){
                scope.updateMarkerPosition($(this), ui);
            }
        };
        element.draggable(options);
    }
});

function MyCtrl($scope, $location) {
    window.scope = $scope;
    
    $scope.settings = {
        columns: 20,
        rows: 20,
        width: 50,
        background: ''
    };
    
    $scope.rows_array = new Array($scope.settings.rows);
    $scope.columns_array = new Array($scope.settings.columns);
    
    $scope.colors = [
        {name: 'black'},
        {name: 'yellow'},
        {name: 'red'},
        {name: 'green'},
        {name: 'blue'},
        {name: 'lime'},
        {name: 'wheat'},
        {name: 'gray'},
        {name: 'orange'},
        {name: 'brown'}
    ];
    
    $scope.statuses = {
        'stunned': {color: 'red'},
        'dazed': {color: 'green'},
        'blinded': {color: 'yellow'}
    };
    
    $scope.myStyle = function(row, column) {
        return {
            width: $scope.settings.width + "px",
            height: $scope.settings.width + "px",
            lineHeight: $scope.settings.width + "px",
            top: row * $scope.settings.width + "px",
            left: column * $scope.settings.width + "px"
        };
    };
    
    $scope.myCreatureStyle = function(creature) {
        if( !creature.width > 0 ) creature.width = $scope.settings.width;
        return {
            background: creature.bgcolor,
            width: $scope.settings.width * creature.width + "px",
            height: $scope.settings.width * creature.height + "px",
            lineHeight: $scope.settings.width + "px",
            top: ( creature.row - 1 ) * $scope.settings.width + "px",
            left: ( creature.column - 1 ) * $scope.settings.width + "px"
        };
    };
    
    $scope.myAreaStyle = function(area) {
        if( !area.width > 0 ) area.width = $scope.settings.width;
        return {
            background: area.bgcolor,
            width: $scope.settings.width * area.width + "px",
            height: $scope.settings.width * area.height + "px",
            lineHeight: $scope.settings.width + "px",
            top: ( area.row - 1 ) * $scope.settings.width + "px",
            left: ( area.column - 1 ) * $scope.settings.width + "px"
        };
    };
    
    $scope.myStatusStyle = function(status) {
        if( typeof $scope.statuses[status] != undefined ){
            bgcolor = $scope.statuses[status].color;
        }else{
            bgcolor = "transparent";
        }
        return {
            background: bgcolor
        }; 
    }
    
    $scope.creatures = [
        {name:'Pippo', visible:true, width: 1, height: 1, row: 1, column: 1, notes: '', bgcolor: $scope.colors[0].name, statuses: {} }
    ];
    
    $scope.areas = [];
    
    $scope.removeCreature = function( toDelete ) {
        var oldCreatures = $scope.creatures;
        $scope.creatures = [];
        angular.forEach(oldCreatures, function(value, key) {
            if ( toDelete != key ) $scope.creatures.push(value);
        });
        
        //aggiorno in automatico?
    };
    
    $scope.getNumber = function(num) {
        return new Array(num);   
    }
    
    $scope.checkEnabled = function(a){
        if (a)
            return true;
        else
            return false;              
    }
    
    $scope.go = function ( path ) {
        $location.path( path );
    };
    
    $scope.updateMarkerPosition = function(obj, ui){
        if( confirm("Are you sure you want to move this marker?") ){
            ind = obj.data("index");
            pos_top = ui.position.top;
            pos_left = ui.position.left;
            nr = Math.round( pos_top / $scope.settings.width ) + 1;
            nc = Math.round( pos_left / $scope.settings.width ) + 1;
            $scope.creatures[ind].column = nc;
            $scope.creatures[ind].row = nr;
            $scope.$apply();
        }
    }
    
};

function newCreature($scope, $location){
    $scope.saveCreature = function(){
        $scope.creatures.push($scope.creature);
        $location.path("/creature/edit/" + ( $scope.creatures.length - 1 ) );
    };
}

function newArea($scope, $location){
    $scope.saveArea = function(){
        $scope.areas.push($scope.area);
        $location.path("/area/edit/" + ( $scope.areas.length - 1 ) );
    };
}

function editCreature($scope, $location, $routeParams){
    //$scope.creature =  $scope.creatures[ $routeParams.id ];
    $scope.creature = angular.copy( $scope.creatures[ $routeParams.id ] );
    $scope.saveCreature = function(){
        $scope.creatures[ $routeParams.id ] = $scope.creature;
        //meglio se passo singoli valori piuttosto che $scope.oggetto
        //altrimenti una volta salvato, se non rimando alla home, si binda tutto in automatico
        $location.path("/");
    };
}

function editArea($scope, $location, $routeParams){
    $scope.area = angular.copy( $scope.areas[ $routeParams.id ] );
    $scope.saveArea = function(){
        $scope.areas[ $routeParams.id ] = $scope.area;
        //meglio se passo singoli valori piuttosto che $scope.oggetto
        //altrimenti una volta salvato, se non rimando alla home, si binda tutto in automatico
        $location.path("/");
    };
}

function editSettings($scope, $location){
    $scope.statusText = "";
    $scope.statusColor = "";
    
    $scope.settings_copy = angular.copy( $scope.settings );
    $scope.save = function(){
        $scope.settings.columns = $scope.settings_copy.columns;
        $scope.settings.rows = $scope.settings_copy.rows;
        $scope.settings.width = $scope.settings_copy.width;
        //$location.path("/");
    };
    
    $scope.removeStatus = function(skey){
        if( confirm("Are you sure you want to delete the \"" + skey + "\" status?") ){
            delete $scope.statuses[skey];
        }
    }
    
    $scope.addStatus = function() {
        $scope.statuses[$scope.statusText] = {color: $scope.statusColor};
        $scope.statusText = '';
    };
}