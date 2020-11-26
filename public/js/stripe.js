import axios from 'axios';
const stripe = Stripe('pk_test_51HRKdeA61x8iFQGwNAQHs0z00n033hztv9zXnMHg3W5xCvWKRaLIkWpKtC7Pyz2Udj1txNtOxqQm09GasBhe1uFD00XgRMVLuv')

export const bookTour = async tourId=>{
    console.log(tourId)
    try {
        console.log('toto')
        //1 get checkout sesison from api url
        const session = await axios.get(`http://127.0.0.1:3003/api/v1/bookings/checkout-session/${tourId}`);
        console.log("🚀 ~ file: stripe.js ~ line 7 ~ session", session)
        
        //2 create checkout plus charge cedit card 
        await stripe.redirectToCheckout({ 
            sessionId: session.data.session.id 
        })
        
    } catch (error) {
        console.error(error)
    }



}