function arrayRemove(arr, value) { 
    
    return arr.filter(function(ele){ 
        return ele !== value; 
    });
}

export default arrayRemove