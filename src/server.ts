import * as bodyParser from "body-parser";
import * as cookieParser from "cookie-parser";
import * as express from "express";
import * as logger from "morgan";
import * as path from "path";
import * as winston from "winston";

import errorHandler = require("errorhandler");
import methodOverride = require("method-override");
import mongoose = require("mongoose");

import {IndexRoute} from "./routes/index";

mongoose.Promise = global.Promise;

winston.configure({
    transports: [
        new (winston.transports.Console)({
            colorize: true,
            level: process.env.NODE_ENV === 'development' ? 'debug' : 'warn',
            prettyPrint: function ( o: Object ){
                return JSON.stringify(o, null, '    ');
            }
        }),
    ]
});


/**
 * The server.
 *
 * @class Server
 */
export class Server {

    public app: express.Application;

    /**
     * Bootstrap the application.
     *
     * @class Server
     * @method bootstrap
     * @static
     * @return {Server} Returns the newly created injector for this app.
     */
    public static bootstrap(): Server {
        return new Server();
    }

    /**
     * Constructor.
     *
     * @class Server
     * @constructor
     */
    constructor() {
        //create Express.js application
        this.app = express();

        let that = this;


        //configure application
        that.config();

        //add routes
        that.routes();

        //add api
        that.api();


    }

    /**
     * Create REST API routes
     *
     * @class Server
     * @method api
     */
    public api() {
        //empty for now
    }

    /**
     * Configure application
     *
     * @class Server
     * @method config
     */
    public config() {
        //add static paths
        this.app.use(express.static(path.join(__dirname, "public")));

        //configure pug
        this.app.set("views", path.join(__dirname, "views"));
        this.app.set("view engine", "pug");

        //mount logger
        this.app.use(logger("dev"));

        //mount json form parser
        this.app.use(bodyParser.json());

        //mount query string parser
        this.app.use(bodyParser.urlencoded({
            extended: true
        }));

        //mount cookie parser
        this.app.use(cookieParser("SECRET_GOES_HERE"));

        //mount override?
        this.app.use(methodOverride());

        // catch 404 and forward to error handler
        this.app.use(function (err: any, req: express.Request, res: express.Response, next: express.NextFunction) {
            err.status = 404;
            next(err);
        });

        //error handling
        this.app.use(errorHandler());
    }

    /**
     * Create and return Router.
     *
     * @class Server
     * @method config
     * @return void
     */
    private routes() {
        let router: express.Router;
        router = express.Router();

        //IndexRoute
        IndexRoute.create(router);

        //use router middleware
        this.app.use(router);
    }

}
