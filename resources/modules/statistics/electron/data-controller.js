class StatisticsController {
    constructor(db_instance, ErrorLoggerClass) {
        this.errorLogger = new ErrorLoggerClass(this.constructor.name);
        this.database = db_instance;
        this.table_name = 'Statistics';
    }

    init() {
        // this.startListeners();
    }

    // async checkDBCreated() {
    //     // return Promise.resolve();
    // }
}

module.exports = StatisticsController;
