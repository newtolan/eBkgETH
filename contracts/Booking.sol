pragma solidity ^0.4.17;

contract Booking {
  address[16] public bookers; 
  //string [] booknos = ['a','b','c','d'];
  uint[16] public booknos;
    // 
  function booked(uint bookId,uint blno) public returns (uint) {
    require(bookId >= 0 && bookId <= 15);  // 确保id在数组长度内
    bookers[bookId] = msg.sender;        // 保存调用这地址 
    booknos[bookId] = blno;            // 对bookno赋值

    return bookId; 
  }
  // 
  function getBookers() public view returns (address[16]) {
    return bookers;
  }

  function setBookno(uint bookId,uint blno) public returns(uint){
      booknos[bookId]=blno;
      return bookId;
  }

  function getBookno(uint bookId) public view returns(uint){
      return  booknos[bookId];
  }
}