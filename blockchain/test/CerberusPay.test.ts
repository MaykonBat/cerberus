import {
  time,
  loadFixture,
} from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { expect } from "chai";
import { ethers } from "hardhat";

describe("CerberusPay Tests", function () {
  async function deployFixture() {
    const [owner, otherAccount] = await ethers.getSigners();

    const CerberusCoin = await ethers.getContractFactory("CerberusCoin");
    const cerberusCoin = await CerberusCoin.deploy();
    await cerberusCoin.waitForDeployment();

    const CerberusPay = await ethers.getContractFactory("CerberusPay");
    const cerberusPay = await CerberusPay.deploy();
    await cerberusPay.waitForDeployment();

    const cerberusAddress = cerberusPay.target;

    await cerberusPay.setAcceptedToken(cerberusCoin.target);

    await cerberusCoin.mint(otherAccount.address, ethers.parseEther("1"));

    return { cerberusPay, cerberusCoin, cerberusAddress, owner, otherAccount };
  }

  it("Should do first payment", async function () {
    const { cerberusPay, cerberusCoin, cerberusAddress, otherAccount } = await loadFixture(deployFixture);

    const instance = cerberusCoin.connect(otherAccount);
    await instance.approve(cerberusAddress, ethers.parseEther("0.01"));

    await expect(cerberusPay.pay(otherAccount.address)).to.emit(cerberusPay, "Paid");
  });

  it("Should NOT do first payment", async function () {
    const { cerberusPay, otherAccount } = await loadFixture(deployFixture);

    await expect(cerberusPay.pay(otherAccount.address)).to.be.revertedWith("Insufficient balance or allowance");
  });

  it("Should do second payment", async function () {
    const { cerberusPay, cerberusCoin, cerberusAddress, otherAccount } = await loadFixture(deployFixture);

    const instance = cerberusCoin.connect(otherAccount);
    await instance.approve(cerberusAddress, ethers.parseEther("0.01"));

    await cerberusPay.pay(otherAccount.address);

    await time.increase(31 * 24 * 60 * 60); // Increase time by 31 days

    await expect(cerberusPay.pay(otherAccount.address)).to.emit(cerberusPay, "Paid");
  });

  it("Should NOT do second payment", async function () {
    const { cerberusPay, cerberusCoin, cerberusAddress, otherAccount } = await loadFixture(deployFixture);

    const instance = cerberusCoin.connect(otherAccount);
    await instance.approve(cerberusAddress, ethers.parseEther("0.01"));

    await cerberusPay.pay(otherAccount.address);

    await time.increase(31 * 24 * 60 * 60); // Increase time by 31 days

    await instance.approve(cerberusAddress, ethers.parseEther("0.00001"));

    await expect(cerberusPay.pay(otherAccount.address)).to.be.revertedWith("Insufficient balance or allowance");
  });

  it("Should do second payment after failure", async function () {
    const { cerberusPay, cerberusCoin, cerberusAddress, otherAccount } = await loadFixture(deployFixture);

    const instance = cerberusCoin.connect(otherAccount);
    await instance.approve(cerberusAddress, ethers.parseEther("0.01"));

    await cerberusPay.pay(otherAccount.address);

    await time.increase(31 * 24 * 60 * 60); // Increase time by 31 days

    await instance.approve(cerberusAddress, ethers.parseEther("0.00001"));

    await expect(cerberusPay.pay(otherAccount.address)).to.be.revertedWith("Insufficient balance or allowance");

    await instance.approve(cerberusAddress, ethers.parseEther("1"));

    await expect(cerberusPay.pay(otherAccount.address)).to.emit(cerberusPay, "Paid");
  });

  it("Should withdraw", async function () {
    const { cerberusPay, cerberusCoin, cerberusAddress, otherAccount } = await loadFixture(deployFixture);

    //test payment
    const value = await cerberusPay.monthlyAmount();
    const instance = cerberusCoin.connect(otherAccount);
    await instance.approve(cerberusAddress, value);
    await cerberusPay.pay(otherAccount.address);
    expect(await instance.balanceOf(cerberusAddress)).to.be.equals(value);

    await cerberusPay.withdraw(value);
    expect(await instance.balanceOf(cerberusAddress)).to.be.equals(0);
  });

});
