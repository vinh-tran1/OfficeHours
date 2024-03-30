export class Class {
    constructor(abbr, name, hours, time, room_abbr, room_street, room_zipcode) {
        this.abbr = abbr;  // also id of the class
        this.name = name;
        this.time = time;
        this.hours = hours;
        this.room_abbr = room_abbr;
        this.room_street = room_street;
        this.room_zipcode = room_zipcode;
    }
}