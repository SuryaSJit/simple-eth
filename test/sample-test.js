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

      await user.connect(addr2).register(addr1.address);
      expect((await user.profile(addr2.address)).referrer).to.be.eq(addr1.address);
      await expect(user.connect(addr2).register(addr1.address)).to.be.revertedWith('User already registered');

    }) 
  })
  describe('Invest', ()=>{
    it('Should invest ',async () =>{
     
      await user.connect(addr1).register(owner.address);
      expect((await user.profile(addr1.address)).referrer).to.be.eq(owner.address);
      await expect(user.connect(addr1).register(owner.address)).to.be.revertedWith('User already registered');

      await user.connect(addr1).invest({value:500});
    })

    it('Should do multiple investment ',async () =>{
      let count1=0;
      let count2=0;
      await user.connect(addr1).register(owner.address);
      expect((await user.profile(addr1.address)).referrer).to.be.eq(owner.address);
      await expect(user.connect(addr1).register(owner.address)).to.be.revertedWith('User already registered');

      await user.connect(addr1).invest({value:500});
      expect((await user.investement(addr1.address,count1)).amount).to.be.eq(500);
      count1++;
      await user.connect(addr1).invest({value:80});
      expect((await user.investement(addr1.address,count1)).amount).to.be.eq(80);
      count1++;

      expect((await user.investement(addr1.address,0)).amount).to.be.eq(500);
      expect((await user.investement(addr1.address,1)).amount).to.be.eq(80);
      

      await user.connect(addr2).register(addr1.address);
      expect((await user.profile(addr2.address)).referrer).to.be.eq(addr1.address);
      await expect(user.connect(addr2).register(addr1.address)).to.be.revertedWith('User already registered');

      await user.connect(addr2).invest({value:100});
      expect((await user.investement(addr2.address,count2)).amount).to.be.eq(100);
      count2++;
      await user.connect(addr2).invest({value:60});
      expect((await user.investement(addr2.address,count2)).amount).to.be.eq(60);
      count2++;

      expect((await user.investement(addr2.address,0)).amount).to.be.eq(100);
      expect((await user.investement(addr2.address,1)).amount).to.be.eq(60);


    })
    it('Should return any interest is there', async () =>{
      await user.connect(addr1).register(owner.address);
      expect((await user.profile(addr1.address)).referrer).to.be.eq(owner.address);
      await expect(user.connect(addr1).register(owner.address)).to.be.revertedWith('User already registered');

      await user.connect(addr1).invest({value:500});

      await user.connect(addr1).checkInterest(0);
      await expect(user.connect(addr1).checkInterest(0)).to.be.revertedWith('User not registered');
      await expect(user.connect(addr1).checkInterest(0)).to.be.revertedWith('No investment found');
      await expect(user.connect(addr1).checkInterest(0)).to.be.revertedWith('You havent reached any maturity period');


    })
  })
});
