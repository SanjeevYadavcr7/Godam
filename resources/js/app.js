import axios from 'axios'
import Noty from 'noty';
// import {initAdmin} from './admin' 
import moment from 'moment';
import { session } from 'passport';

let addToCart = document.querySelectorAll('.add-to-cart');
let cartCounter = document.querySelector('#cartCounter');


function updateCart(pizza){
    axios.post('/update-cart',pizza).then(res =>{
        // console.log(res)  // receieving response on cart button click 
        cartCounter.innerText = res.data.totalQty // displaying quantity in cart button
        
        // adding Notyng alert each on item selection
        new Noty({
            type:'success',
            timeout:1000,
            text: 'Item added to cart',
            progressBar: false,
            layout:'topRight'
        }).show();
    }).catch(err =>{
        new Noty({
            type:'error',  // if any error occurs
            timeout:1000,
            text: 'Something went wrong : UPDATE_CART',
            progressBar: false,
            layout:'topRight'
        }).show();
    })
}


addToCart.forEach((btn) => {
    btn.addEventListener('click',(e) => {
        let pizza = JSON.parse(btn.dataset.pizza)
        updateCart(pizza)
    })
})


// for deleting items
let cartVar = document.querySelectorAll('.add-cart');
// console.log("CartVar = ",cartVar)
cartVar.forEach((btn) => {
    btn.addEventListener('click',(e) => {
        let pizza = JSON.parse(btn.dataset.pizza)
        deleteCart(pizza)
    })
})
function deleteCart(pizza){
    console.log("Pizza to be deleted = ",pizza)
    axios.post('/delete-cart',pizza).then(res =>{
        // console.log(res)  // receieving response on cart button click 

        new Noty({
            type:'success',
            timeout:1000,
            text: 'Item removed from cart',
            progressBar: false,
            layout:'topRight'
        }).show();
    }).catch(err =>{
        new Noty({
            type:'error',  // if any error occurs
            timeout:1000,
            text: 'Something went wrong : DELETE_CART',
            progressBar: false,
            layout:'topRight'
        }).show();
    })
}

// Removing alert after 2s since order is successfully placed
const alertMsg = document.querySelector('#success-alert');
if(alertMsg){
    setTimeout(() => {
        alertMsg.remove()
    },2000)
}


function initAdmin(socket) {
    // console.log('Inside InitAdmin');
    const orderTableBody = document.querySelector('#orderTableBody');
    // console.log(orderTableBody);
    let orders = []
    let markup

    axios.get('/admin/orders', {
        headers: {
            "X-Requested-With": "XMLHttpRequest"
        }
    }).then(res => {
        // console.log(res.data);
        orders= res.data
        markup = generateMarkup(orders)
        // console.log(markup)
        orderTableBody.innerHTML = markup
    }).catch(err => {
        console.log(err)
    });

    function renderItems(items) {
        let parsedItems = Object.values(items)
        // consolelog('PARS: ', parsedItems)
        return parsedItems.map((menuItem) => {
            return `
            <p>${ menuItem.item.name } - ${ menuItem.qty } pcs </p>
            `
        }).join('')
    }


    function generateMarkup(orders){
        return orders.map(order => {
            return `
            <tr>
            <td class="border px-4 py-2 text-green-900">
                <p>${order._id}</p>
                <div>${ renderItems(order.items)}</div>
            </td>
            <td class="border px-4 py-2">${order.customerId.name}</td>
            <td class="border px-4 py-2">${order.address}</td>
            <td class="border px-4 py-2">
                <div class="inline-block relative w-64">
                    <form action="/admin/order/status" method="POST">
                        <input type="hidden" name="orderId" value="${order._id}">
                        
                        <select name="status" onchange="this.form.submit()"
                        class="block appearance-none w-full bg-white border border-gray-400
                        hover:border-gray-500 px-4 py-2 pr-8 rounded shadow leading-tight 
                        focus:outline-none focus:shadow-outline">
                        <option value="order_placed" ${order.status === 'order_placed' ? 'selected' : ''}>Placed</option>
                        <option value="confirmed" ${order.status === 'confirmed' ? 'selected' : ''}>Confirmed</option>
                        <option value="prepared" ${order.status === 'prepared' ? 'selected' : ''}>Prepared</option>
                        <option value="delivered" ${order.status === 'delivered' ? 'selected' : ''}>Delivered</option>
                        <option value="completed" ${order.status === 'completed' ? 'selected' : ''}>Completed</option>
                        </select>
                    </form>
                    <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700 ">
                        <svg class="fill-current h-4 w-4" xmlns="https://www.w3.org/2000/svg" viewBox="0 0 20 20">
                            <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />

                        </svg>
                    </div>
                </div>
            </td>
                <td class="border px-4 py-2">
                    ${ moment(order.createdAt).format('hh:mm A')}
                </td>
            </tr>
            `
        }).join('')  
    }

    socket.on('orderPlaced', (order) => {
        new Noty({
            type:'success',
            timeout:1000,
            text: 'New order arrived',
            progressBar: false,
            layout:'topRight'
        }).show();
        orders.unshift(order)
        orderTableBody.innerHTML = ''
        orderTableBody.innerHTML = generateMarkup(orders)
    })

}


function initAdmin2(socket) {
    // console.log('Inside InitAdmin2');
    const orderTableBodyProfile = document.querySelector('#orderTableBodyProfile');
    // console.log(orderTableBody);
    let orders = []
    let markup

    axios.get('/admin/adminAccount', {
        headers: {
            "X-Requested-With": "XMLHttpRequest"
        }
    }).then(res => {
        // console.log(res.data);
        orders= res.data
        markup = generateMarkup(orders)
        // console.log(markup)
        orderTableBodyProfile.innerHTML = markup
    }).catch(err => {
        console.log(err)
    });

    function renderItems(items) {
        let parsedItems = Object.values(items)
        // consolelog('PARS: ', parsedItems)
        return parsedItems.map((menuItem) => {
            return `
            <p>${ menuItem.item.name } - ${ menuItem.qty } pcs </p>
            `
        }).join('')
    }


    function generateMarkup(orders){
        return orders.map(order => {
            return `
            <tr class="text-center">
            <td class="px-4 py-1 text-green-900">
                <p class="text-xs">${order._id}</p>
            </td>
            <td class="px-4 py-1 text-xs">${order.customerId.name}</td>
            <td class="px-4 py-1 text-xs capitalize">${order.status}</td>
            <td class="px-4 py-1 text-xs">${ moment(order.createdAt).format('hh:mm A')}</td>
            </tr>
            `
        }).join('')  
    }

    socket.on('orderPlaced', (order) => {
        new Noty({
            type:'success',
            timeout:1000,
            text: 'New order arrived',
            progressBar: false,
            layout:'topRight'
        }).show();
        orders.unshift(order)
        orderTableBodyProfile.innerHTML = ''
        orderTableBodyProfile.innerHTML = generateMarkup(orders)
    })

}



// Change order status
let stasuses = document.querySelectorAll('.status-line')
let hiddenInput = document.querySelector('#hiddenInput')
let order = hiddenInput ? hiddenInput.value : null
order = JSON.parse(order)
let time = document.createElement('small')

function updateStatus(order){

    stasuses.forEach((status) => {
        status.classList.remove('step-completed')
        status.classList.remove('current')
    })


    let stepCompleted = true;
    stasuses.forEach((status) => {
        // obtaining data-status = "" values from sinleOrder.js
        let dataProp = status.dataset.status
        if(stepCompleted){
            status.classList.add('step-completed')
        }
        
        // comparing received status(sinleOrder.js) to order's status in database  
        if(dataProp === order.status){
            stepCompleted = false
            time.innerText = moment(order.updatedAt).format('hh:mm A')
            status.appendChild(time)
            if(status.nextElementSibling){
                status.nextElementSibling.classList.add('current')
            }
        }
    })


}

updateStatus(order)


// Socket Connection
let socket = io()

// Join room
if(order){
    // accessing order from hidden input(sinleorder.js) variable declared in above section
    socket.emit('join',`order_${order._id}`)   
}

let adminAreaPath = window.location.pathname
if(adminAreaPath.includes('admin')){
    initAdmin(socket);
    initAdmin2(socket);
    socket.emit('join','adminRoom')
}


socket.on('orderUpdated',(data) => {
    const updatedOrder = {...order}   //storing copy of an order
    updatedOrder.updatedAt = moment().format()
    updatedOrder.status = data.status
    updateStatus(updatedOrder)
    new Noty({
        type:'success',
        timeout:1000,
        text: 'Order updated',
        progressBar: false,
        layout:'topRight'
    }).show();
})