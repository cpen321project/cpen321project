package com.example.findyourpeers;


import android.util.Log;

import java.io.UnsupportedEncodingException;
import java.security.InvalidKeyException;
import java.security.NoSuchAlgorithmException;
import java.security.spec.InvalidKeySpecException;
import java.security.spec.KeySpec;
import java.util.Base64;

import javax.crypto.BadPaddingException;
import javax.crypto.Cipher;
import javax.crypto.IllegalBlockSizeException;
import javax.crypto.NoSuchPaddingException;
import javax.crypto.SecretKey;
import javax.crypto.SecretKeyFactory;
import javax.crypto.spec.PBEKeySpec;
import javax.crypto.spec.SecretKeySpec;

public class Crypto {
    public static SecretKey generateSecretKeyBasedonChatId(String chatId, String salt) throws InvalidKeySpecException, NoSuchAlgorithmException {
        SecretKeyFactory secretKeyfactory = SecretKeyFactory.getInstance("PBKDF2WithHmacSHA256");
        KeySpec keySpec = new PBEKeySpec(chatId.toCharArray(), salt.getBytes(), 65536, 256);
        SecretKey secretKey = new  SecretKeySpec(secretKeyfactory.generateSecret(keySpec).getEncoded(), "AES");
        Log.d("generating public Key", secretKey.toString());
        return secretKey;
    }
    public static String encrypt(String input, SecretKey key) throws InvalidKeyException, IllegalBlockSizeException, BadPaddingException, NoSuchPaddingException, NoSuchAlgorithmException, UnsupportedEncodingException {
        Log.d("encrypting a message", input);
        Cipher cipher = Cipher.getInstance("AES/ECB/NoPadding");
        cipher.init(Cipher.ENCRYPT_MODE, key);
        byte[] cipherText = cipher.doFinal(input.getBytes("UTF-8"));
        String encryptedText = Base64.getEncoder().encodeToString(cipherText);
        Log.d("encrypting a message", encryptedText);
        return encryptedText;
    }

    public static String decrypt(String cipherText, SecretKey key) throws NoSuchPaddingException, NoSuchAlgorithmException, IllegalBlockSizeException, BadPaddingException, InvalidKeyException {
        Log.d("decrypting a message", cipherText);
        Cipher cipher = Cipher.getInstance("AES/ECB/NoPadding");
        cipher.init(Cipher.DECRYPT_MODE, key);
        byte[] decryptedText = cipher.doFinal(Base64.getDecoder().decode(cipherText));
        Log.d("decrypting a message", new String(decryptedText));
        return new String(decryptedText);
    }
//
//    public static void generateSecretKeyBasedOnDevice() throws NoSuchAlgorithmException, InvalidKeyException {
//        KeyPairGenerator kpg = KeyPairGenerator.getInstance("EC");
//        kpg.initialize(128);
//        KeyPair kp = kpg.generateKeyPair();
//        PublicKey publickey = kp.getPublic();
//        KeyAgreement keyAgreement = KeyAgreement.getInstance("ECDH");
//        keyAgreement.init(kp.getPrivate());
//        Log.d("publicKey", publickey.toString());
//    }
}
