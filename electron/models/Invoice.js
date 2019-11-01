module.exports = function(sequelize, DataTypes){
    return sequelize.define('Invoice', {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        number: {
            type: DataTypes.STRING,
            unique: true,
            allowNull: false
        },
        issueDate: {
            type: DataTypes.DATE,
            field: 'issue_date',
            allowNull: false
        },
        issuePlace: {
            type: DataTypes.STRING,
            field: 'issue_place',
            allowNull: true
        },
        note: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        status: {
            type: DataTypes.STRING,
            unique: false,
            allowNull: true
        }
    })
};

// id: string; // RethinkDB ID
// number: string = '';
// status: 'new' | 'archived' = 'new'; // 'new' | 'archived'
// selected?: boolean = false;
// issue_date?: string;
// issue_place: string = 'София';
// recipient: Recipient = new Recipient();
// type: string = '';
// notes: string = '';
// provider: Provider = new Provider();
// goods: Goods[] = [];
// total_sum: number;
// creation_date: string;
// update_date: string;
