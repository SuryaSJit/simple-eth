const { expect } = require("chai");

describe("Register",  () => {

  let User,user,owner,addr1,addr2,addr3;

  beforeEach(async ()=>{
    [owner,addr1,addr2,addr3] = await ethers.getSigners();
    User = await ethers.getContractFactory('UserRegister');
    user =  await User.deploy();
  });

  describe('Registration', ()=>{
    it('Should register user with referrer',async ()=>{
      await user.connect(addr1).register(owner.address);
      expect((await user.profile(addr1.address)).referrer).to.be.eq(owner.address);
      await expect(user.connect(addr1).register(owner.address)).to.be.revertedWith('User already registered');

    }) 
  })
  describe('Invest', ()=>{
    it('Should invest ',async () =>{
      await user.connect(addr1).register(owner.address);
      expect((await user.profile(addr1.address)).referrer).to.be.eq(owner.address);
      await expect(user.connect(addr1).register(owner.address)).to.be.revertedWith('User already registered');
      await user.connect(addr1).invest({value:50});
    })
  })
});
