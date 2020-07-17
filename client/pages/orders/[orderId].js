import { useEffect, useState } from 'react';
import useRequest from '../../hooks/use-request';
import StripeCheckout from 'react-stripe-checkout';
import Router from 'next/router';

const OrderShow = ({ order, currentUser }) => {
  const [timeLeft, setTimeLeft] = useState(0);
  const { doRequest, errors } = useRequest({
    url: '/api/payments',
    method: 'post',
    body: {
      orderId: order.id
    },
    onSuccess: () => Router.push('/orders')
  })

  useEffect(() => {
    const findTimeLeft = () => {
      const currentTime = new Date().getTime();
      const expirationDate = new Date(order.expiresAt).getTime();
      const msLeft = expirationDate - currentTime;
      setTimeLeft(Math.round(msLeft / 1000));
    };

    findTimeLeft();
    const timerId = setInterval(findTimeLeft, 1000);

    return () =>{
      clearInterval(timerId);
    };
  }, [order]);

  if (timeLeft < 0) {
    return <div>Order Expired</div>
  }

  return <div>
    Time left to pay: {timeLeft} seconds
    <StripeCheckout 
      token={({ id }) => doRequest({ token: id })}
      stripeKey="pk_test_51H5JdlJXZ8aAmccqWF5dK4tYuhYIbc76XFvXlTR8vKvuTDL0I2j6pvkiSOVMSqGEKpQHIS55h79144Vd2xK0hdlJ00Mj43p7SF"
      amount={order.ticket.price * 100}
      email={currentUser.email}
    />
    {errors}
  </div>
}

OrderShow.getInitialProps = async (context, client) => {
  const { orderId } = context.query;
  const { data } = await client.get(`/api/orders/${orderId}`);

  return { order: data };
};

export default OrderShow;
