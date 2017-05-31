exports.DATABASE_URL = process.env.DATABASE_URL ||
                       global.DATABASE_URL ||
                       'mongodb://dafear:sidney12@ds155091.mlab.com:55091/showup';
                    exports.TEST_DATABASE_URL = 
                  	process.env.TEST_DATABASE_URL ||
	                  'mongodb://localhost/test-showup'; 

                 	exports.PORT = process.env.PORT || 8080;

//'mongodb://localhost/showup';