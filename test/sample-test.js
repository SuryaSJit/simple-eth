const { expect, should } = require("chai");

describe("Register",  () => {

  let User,user,owner,addr1,addr2,addr3,count1 = 0,count2 = 0;

  beforeEach(async ()=>{
    [owner,addr1,addr2,addr3] = await ethers.getSigners();
    User = await ethers.getContractFactory('UserRegister');
    user =  await User.deploy();
    
  });

  describe('Registration', ()=>{
    it('Should register user with referrer',async ()=>{
      await user.connect(addr1).register(owner.address,{value:20});
      expect((await user.profile(addr1.address)).referrer).to.be.eq(owner.address);
      await expect(user.connect(addr1).register(owner.address,{value:20})).to.be.revertedWith('User already registered');

      await user.connect(addr2).register(addr1.address,{value:20});
      expect((await user.profile(addr2.address)).referrer).to.be.eq(addr1.address);
      await expect(user.connect(addr2).register(addr1.address,{value:20})).to.be.revertedWith('User already registered');

    }) 
  })
  describe('Invest', ()=>{
    it('Should revert if user already registered ', async () =>{
      await user.connect(addr1).register(owner.address,{value:20});
      expect((await user.profile(addr1.address)).referrer).to.be.eq(owner.address);
      await expect(user.connect(addr1).register(owner.address,{value:20})).to.be.revertedWith('User already registered');

    })
    it('Should invest ',async () =>{
     
      await user.connect(addr1).register(owner.address,{value:20});
      expect((await user.profile(addr1.address)).referrer).to.be.eq(owner.address);
      await expect(user.connect(addr1).register(owner.address,{value:20})).to.be.revertedWith('User already registered');

      await user.connect(addr1).invest({value:500});
    })
    it('Should do multiple investment ',async () =>{

    
      await user.connect(addr1).register(owner.address,{value:20});
      count1++;

      expect((await user.profile(addr1.address)).count).to.be.eq(count1);
      await user.connect(addr1).invest({value:500});
      expect((await user.investement(addr1.address,count1)).amount).to.be.eq(500);
      count1++;

      expect((await user.profile(addr1.address)).count).to.be.eq(count1);
      await user.connect(addr1).invest({value:80});
      expect((await user.investement(addr1.address,count1)).amount).to.be.eq(80);
      count1++;

      await user.connect(addr2).register(addr1.address,{value:20});
      count2++;

      expect((await user.profile(addr2.address)).count).to.be.eq(count2);
      await user.connect(addr2).invest({value:100});
      expect((await user.investement(addr2.address,count2)).amount).to.be.eq(100);
      count2++;

      expect((await user.profile(addr2.address)).count).to.be.eq(count2);
      await user.connect(addr2).invest({value:60});
      expect((await user.investement(addr2.address,count2)).amount).to.be.eq(60);
      count2++;

    })
    it('Should return any interest is there', async () =>{
      await user.connect(addr1).register(owner.address,{value:20});
      await user.connect(addr1).invest({value:500});
      await user.connect(addr1).ROI();

      await user.connect(addr2).register(addr1.address,{value:20});
      await user.connect(addr2).invest({value:500});
      await user.connect(addr2).ROI();
    })

    it('Should return user not registerd',async () =>{
      await user.connect(addr1).register(owner.address,{value:20});
      await user.connect(addr1).invest({value:500});
      await user.connect(addr1).ROI();
      await expect(user.connect(addr3).ROI()).to.be.revertedWith('User not registered');

      await user.connect(addr2).register(addr1.address,{value:20});
      await user.connect(addr2).invest({value:500});
      await user.connect(addr2).ROI();
      await expect(user.connect(addr3).ROI()).to.be.revertedWith('User not registered');

    })
    // it('Should return user not invested',async () =>{
    //   await user.connect(addr1).register(owner.address,{value:20});
    //   await user.connect(addr1).invest({value:110});
    //   await user.connect(addr1).ROI();
    //   await expect(user.connect(addr1).ROI()).to.be.revertedWith('No investment found');

    //   await user.connect(addr2).register(addr1.address,{value:20});
    //   await user.connect(addr2).invest({value:110});
    //   await user.connect(addr2).ROI();
    //   await expect(user.connect(addr2).ROI()).to.be.revertedWith('No investment found');

    // }) 
  })
});
