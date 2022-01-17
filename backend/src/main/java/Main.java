import java.io.IOException;
import java.io.UnsupportedEncodingException;
import java.util.ArrayList;
import java.util.List;

import org.apache.http.HttpEntity;
import org.apache.http.client.entity.UrlEncodedFormEntity;
import org.apache.http.client.methods.CloseableHttpResponse;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClients;
import org.apache.http.message.BasicNameValuePair;
import org.apache.http.util.EntityUtils;
import static spark.Spark.*;



public class Main {

    public static void main(String[] args) throws IOException {

        get("/generatePaymentIntent", (request, response) -> generateNewPaymentIntent());

        System.out.println("Hello World!");


    }


    private static String generateNewPaymentIntent() throws IOException {
        CloseableHttpClient httpclient = HttpClients.createDefault();
        HttpPost httppost = new HttpPost("https://mehdieurope-test.chargebee.com/api/v2/payment_intents");
        httppost.addHeader("Authorization","Basic dGVzdF95TXpuNTl3eExTY3VQTHJZR2JHUHVmNFVQbFRib2hOQVQ6");

        // Request parameters and other properties.
        List<BasicNameValuePair> params = new ArrayList<>(2);
        params.add(new BasicNameValuePair("amount", "15000"));
        params.add(new BasicNameValuePair("currency_code", "USD"));
        try {
            httppost.setEntity(new UrlEncodedFormEntity(params, "UTF-8"));
        } catch (UnsupportedEncodingException e) {
            e.printStackTrace();
        }

        //Execute and get the response.
        CloseableHttpResponse response = null;
        try {
            response = httpclient.execute(httppost);
        } catch (IOException e) {
            e.printStackTrace();
        }
        HttpEntity entity = response.getEntity();


        String responseString = EntityUtils.toString(entity);
        if(responseString.contains("{\"payment_intent\": ")){
            responseString = responseString.split("payment_intent\": ")[1];
            responseString=responseString.substring(0,responseString.length()-1);
        }
        return responseString;
        /*
        System.out.println("RESULT IS: \n" + responseString);
        System.out.println("\n\n\n\n");
        JSONObject result = new JSONObject(responseString); //Convert String to JSON Object

        try {
            JSONObject paymentIntent = result.getJSONObject("payment_intent");
            String paymentIntentId = paymentIntent.getString("id");
            System.out.println("PaymentIntentId to retrieve: \n " + paymentIntent.toString());

        } catch(Exception e) {
            e.printStackTrace();
        }
        */
    }
}
