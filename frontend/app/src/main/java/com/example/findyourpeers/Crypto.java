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
        Log.d("generating public Key", String.valueOf(secretKey.getEncoded()));
        return secretKey;
    }
    public static String encrypt(String input, SecretKey key) throws InvalidKeyException, IllegalBlockSizeException, BadPaddingException, NoSuchPaddingException, NoSuchAlgorithmException, UnsupportedEncodingException {
        Log.d("encrypting a message", input);
        Cipher cipher = Cipher.getInstance("AES/ECB/PKCS5Padding");
        cipher.init(Cipher.ENCRYPT_MODE, key);
        byte[] cipherText = cipher.doFinal(input.getBytes("UTF-8"));
        String encryptedText = Base64.getEncoder().encodeToString(cipherText);
        return encryptedText;
    }

    public static String decrypt(String cipherText, SecretKey key) throws NoSuchPaddingException, NoSuchAlgorithmException, IllegalBlockSizeException, BadPaddingException, InvalidKeyException, UnsupportedEncodingException {
        if (cipherText == null)
            return " ";
        cipherText.replace('=', ' ');
        Log.d("decrypting a message", cipherText);
        Cipher cipher = Cipher.getInstance("AES/ECB/PKCS5Padding");
        cipher.init(Cipher.DECRYPT_MODE, key);
        byte[] plainText = cipher.doFinal(cipherText.getBytes());
        return new String(plainText, "UTF-8");
    }
}
