
class ApiFilters{
    constructor(query,queryStr){
        this.query=query;
        this.queryStr=queryStr;
    }

    search(){
      const keyword = this.queryStr.keyword ? {
        name:{
            $regex:this.queryStr.keyword,
            $options:'i'
        }
      }:{}

      this.query = this.query.find({...keyword})
      return this;
      
    }
    filter(){
     const queryCopy= {...this.queryStr};

     //removing the keyword field for search
     const fieldToRemove=['keyword']
     fieldToRemove.forEach((el)=>delete queryCopy[el]);
 
   

     //advance search for the rating,price etc...

     let queryStr=JSON.stringify(queryCopy);
     queryStr = queryStr.replace(/\b(gt|gte|lt|lte)\b/g, (match)=> `$${match}`);



    let parsedQueryString = JSON.parse(queryStr)

    // parsedQueryString.$options='i';
   
     
     this.query=this.query.find(parsedQueryString);
     return this;

    }
}

export default ApiFilters;