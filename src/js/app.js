App = {
  web3Provider: null,
  contracts: {},

  init: function() {
    // Load booking list.
    $.getJSON('../booklist.json', function(data) {
      var bookingRow = $('#bookingRow');
      var bookingTemplate = $('#bookingTemplate');

      for (i = 0; i < data.length; i ++) {
        bookingTemplate.find('.panel-title').text(!!data[i].bookno?data[i].bookno:"x");
      //  bookingTemplate.find('img').attr('src', data[i].picture);
        bookingTemplate.find('.booking-booker').text(data[i].booker);
        bookingTemplate.find('.booking-vans').text(data[i].vans);
        bookingTemplate.find('.booking-ctnrtype').text(data[i].ctnrtype);
        bookingTemplate.find('.btn-booking').attr('data-id', data[i].id);

        bookingRow.append(bookingTemplate.html());
      }
    });

    return App.initWeb3();
  },

  initWeb3: function() {
     // Is there an injected web3 instance?
    if (typeof web3 !== 'undefined') {
      App.web3Provider = web3.currentProvider;
    } else {
    // If no injected web3 instance is detected, fall back to Ganache
      App.web3Provider = new Web3.providers.HttpProvider('HTTP://127.0.0.1:7545');
    }
    web3 = new Web3(App.web3Provider);

    return App.initContract();
   
  },

  initContract: function() {
   // 加载Booking.json，保存了booking的ABI（接口说明）信息及部署后的网络(地址)信息，它在编译合约的时候生成ABI，在部署的时候追加网络信息
    $.getJSON('Booking.json', function(data) {
    // 用Booking.json数据创建一个可交互的TruffleContract合约实例。
      var BookingArtifact = data;
      App.contracts.Booking = TruffleContract(BookingArtifact);
    // Set the provider for our contract
      App.contracts.Booking.setProvider(App.web3Provider);
    // Use our contract to retrieve and mark the booking
      return App.markBooked();
    });
    return App.bindEvents();
  },

  bindEvents: function() {
    $(document).on('click', '.btn-booking', App.handleBooked);
  },

  markBooked: function(bookers, account) {
    var bookingInstance;
    
    App.contracts.Booking.deployed().then(function(instance) {
    bookingInstance = instance;
    // 调用合约的getBookers(), 用call读取信息不用消耗gas
    return bookingInstance.getBookers.call();
    }).then(function(bookers) {
      for (i = 0; i < bookers.length; i++) {
       if (bookers[i] !== '0x0000000000000000000000000000000000000000') {
        $('.panel-booking').eq(i).find('button').text('Success').attr('disabled', true);
        /* var title = $('.panel-title').eq(i); 
         bookingInstance.getBookno(i).then(function(bookno){
          title.text(bookno.toNumber());  写法对比：这个写法只能显示最新交易那条记录状态*/ 

         bookingInstance.getBookno(i).then(function(title){
           return  function(bookno){
               title.text(bookno.toNumber());
            }
         }($('.panel-title').eq(i)));
      }
    }
    }).catch(function(err) {
      console.log(err.message);
    });
  },

  handleBooked: function(event) {
    event.preventDefault();
    var bookId = parseInt($(event.target).data('id'));
    var bookingInstance;
  // 获取用户账号
    web3.eth.getAccounts(function(error, accounts) {
    if (error) {
      console.log(error);
      }
      var account = accounts[0];
   
      App.contracts.Booking.deployed().then(function(instance) {
      bookingInstance = instance;
   
      // 发送交易booking
      var num = Math.floor(Math.random()*(9999999999-1111111111+1)+1111111111);
      return bookingInstance.booked(bookId,num,{from: account});
      }).then(function(result) {
        return App.markBooked();
      }).catch(function(err) {
        console.log(err.message);
      });
    });
  }

};

$(function() {
  $(window).load(function() {
    App.init();
  });
});
