package com.bankdemo.bankapp;

import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class BankAccountService {
    private final BankAccountRepository repository;

    public BankAccountService(BankAccountRepository repository) {
        this.repository = repository;
    }

    public BankAccount createAccount(String name, String type, Double initialDeposit) {
        BankAccount account = new BankAccount(name, type, initialDeposit);
        return repository.save(account);
    }

    public List<BankAccount> getAllAccounts() {
        return repository.findAll();
    }

    public BankAccount getAccountById(Long id){
        return repository.findById(id) .orElseThrow(() -> new RuntimeException("Account not found with id: " + id));
    }

    public BankAccount deposit(Long id, Double amount){
        BankAccount account = getAccountById(id);
        if(amount <= 0){
            throw new IllegalArgumentException("Deposit amount must be greater than zero");
        }
        account.setBalance(account.getBalance()+amount);
        return repository.save(account);
    }

    public BankAccount withdraw(Long id, Double amount){
        BankAccount account = getAccountById(id);
        if (amount <= 0) {
            throw new IllegalArgumentException("Withdraw amount must be greater than zero");
        }

        if (account.getBalance() < amount) {
            throw new RuntimeException("Insufficient balance for withdrawal");
        }
        account.setBalance(account.getBalance() - amount);
        return repository.save(account);
    }
}
