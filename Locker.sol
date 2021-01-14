pragma solidity >=0.4.22 <0.6.0;

contract Locker {
    address[] array;
    

    event openLog(address _sender, string _logText);
    event errLog(address _sender);

    constructor(address _pass0,address _pass1,address _pass2,address _pass3) public {
        array.push(_pass0);
        array.push(_pass1);
        array.push(_pass2);
        array.push(_pass3);
    }

    function openLocker(address _pass,uint8 _num) public {
        if(array[_num] != _pass) {
            emit errLog(msg.sender);
            return;
        }
        emit openLog(msg.sender, "[INFO]LOCKER OPEN");
    }
}