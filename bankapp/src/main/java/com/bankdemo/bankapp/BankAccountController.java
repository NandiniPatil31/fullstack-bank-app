package com.bankdemo.bankapp;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api/accounts")
public class BankAccountController {
    private final BankAccountService service;

    public BankAccountController(BankAccountService service) {
        this.service = service;
    }

    @PostMapping
    public BankAccount createAccount(@RequestBody AccountRequest request) {
        System.out.println("Received deposit: " + request.getInitialDeposit());
        return service.createAccount(
                request.getAccountHolderName(),
                request.getAccountType(),
                request.getInitialDeposit()
        );
    }

    @GetMapping
    public List<BankAccount> getAllAccounts(){
        return service.getAllAccounts();
    }

    @GetMapping("/{id}")
    public BankAccount getAccount(@PathVariable Long id){
        return service.getAccountById(id);
    }

    @PutMapping("/{id}/deposit")
    public BankAccount deposit(@PathVariable Long id, @RequestBody TransactionRequest request){
        return service.deposit(id, request.getAmount());
    }

    @PutMapping("/{id}/withdraw")
    public BankAccount withdraw(@PathVariable Long id, @RequestBody TransactionRequest request){
        return service.withdraw(id, request.getAmount());
    }
}
