import {
  time,
  loadFixture,
} from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { expect } from "chai";
import { ethers } from "hardhat";

describe("CerberusPay Tests", function () {
  async function deployFixture() {
    const [owner, otherAccount] = await ethers.getSigners();

    const CerberusPay = await ethers.getContractFactory("CerberusPay");
    const cerberusPay = await CerberusPay.deploy();

    return { cerberusPay, owner, otherAccount };
  }

  it("Should ", async function () {
    const { cerberusPay, owner, otherAccount } = await loadFixture(
      deployFixture,
    );

    //expect(await lock.unlockTime()).to.equal(unlockTime);
  });
});
