import java.io.IOException;
import java.io.UnsupportedEncodingException;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import org.apache.http.HttpEntity;
import org.apache.http.client.entity.UrlEncodedFormEntity;
import org.apache.http.client.methods.CloseableHttpResponse;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClients;
import org.apache.http.message.BasicNameValuePair;
import org.apache.http.util.EntityUtils;
import spark.Request;

import static spark.Spark.*;



public class Main {

    public static String GATEWAY_ACCOUNT_ID_MOLLIE = "gw_199LU2Swrma4KDp";
    public static String GATEWAY_ACCOUNT_ID_ADYEN_MAIN = "gw_19AAMBSjqrugX1kv";
    public static String GATEWAY_ACCOUNT_ID_ADYEN_SECONDARY = "gw_19AAAxSkNyRMG9FA";
    public static String GATEWAY_ACCOUNT_ID_STRIPE = "gw_199LVbSfmu8yx1";
    public static String GATEWAY_ACCOUNT_ID_BRAINTREE = "gw_199LaDSpmLvhQ8b";

    public static String AMOUNT = "15000";
    public static String CURRENCY_CODE = "USD";
    public static String GATEWAY_ACCOUNT_ID = GATEWAY_ACCOUNT_ID_STRIPE;

    public static void main(String[] args) throws IOException {

        get("/generatePaymentIntent", (request, response) -> generateNewPaymentIntent(request));

        get("/createCustomer", (request, response) -> createNewCustomer(request));

    }

    private static String createNewCustomer(Request request) throws IOException {
        System.out.println("CREATING A NEW CUSTOMER");
        CloseableHttpClient httpclient = HttpClients.createDefault();
        HttpPost httppost = new HttpPost("https://mehdieurope-test.chargebee.com/api/v2/customers");
        httppost.addHeader("Authorization","Basic dGVzdF95TXpuNTl3eExTY3VQTHJZR2JHUHVmNFVQbFRib2hOQVQ6");

        // Request parameters and other properties.
        List<BasicNameValuePair> params = new ArrayList<>(2);

        if(request.queryParams("intentId") != null){
            params.add(new BasicNameValuePair("payment_intent[id]", request.queryParams("intentId")));
        }
        if(request.queryParams("customerId") != null && request.queryParams("customerId").length()>3){
            params.add(new BasicNameValuePair("id", request.queryParams("customerId")));
        }

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
        if(responseString.contains("{\"customer\": ")){
            responseString = responseString.split("customer\": ")[1];
            responseString=responseString.substring(0,responseString.length()-1);
        }
        return responseString;
    }

    private static String generateNewPaymentIntent(Request request) throws IOException {
        System.out.println("CREATING A NEW PAYMENT INTENT");
        CloseableHttpClient httpclient = HttpClients.createDefault();
        HttpPost httppost = new HttpPost("https://mehdieurope-test.chargebee.com/api/v2/payment_intents");
        httppost.addHeader("Authorization","Basic dGVzdF95TXpuNTl3eExTY3VQTHJZR2JHUHVmNFVQbFRib2hOQVQ6");

        // Request parameters and other properties.
        List<BasicNameValuePair> params = new ArrayList<>(2);

        if(request.queryParams("amount") != null && isNumeric(request.queryParams("amount"))){
            AMOUNT = request.queryParams("amount");
        }
        params.add(new BasicNameValuePair("amount", AMOUNT));
        if(request.queryParams("currency_code") != null && !isNumeric(request.queryParams("currency_code")) && request.queryParams("currency_code").length()==3){
            CURRENCY_CODE = request.queryParams("currency_code");
        }
        params.add(new BasicNameValuePair("currency_code", CURRENCY_CODE));

        if(request.queryParams("gateway") != null && !isNumeric(request.queryParams("gateway"))){
            GATEWAY_ACCOUNT_ID = pickGateway(request.queryParams("gateway"));
        }
        params.add(new BasicNameValuePair("gateway_account_id", GATEWAY_ACCOUNT_ID));

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



    static String pickGateway(String gatewayCode){
        switch(gatewayCode){
            case "stripe":
                return GATEWAY_ACCOUNT_ID_STRIPE;
            case "adyen":
                return GATEWAY_ACCOUNT_ID_ADYEN_MAIN;
            case "braintree":
                return GATEWAY_ACCOUNT_ID_BRAINTREE;
            case "mollie":
                return GATEWAY_ACCOUNT_ID_MOLLIE;
            default:
                return GATEWAY_ACCOUNT_ID_ADYEN_MAIN;
        }
    }

    public static boolean isNumeric(String strNum) {
        if (strNum == null) {
            return false;
        }
        try {
            double d = Double.parseDouble(strNum);
        } catch (NumberFormatException nfe) {
            return false;
        }
        return true;
    }
}
