function arrayRemove(arr : Array<string>, value : string) : Array<string> { 
    
    return arr.filter(function(ele){ 
        return ele !== value; 
    });
}

export default arrayRemove