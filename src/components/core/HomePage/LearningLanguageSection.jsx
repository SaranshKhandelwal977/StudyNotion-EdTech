import React from 'react'
import HighlightText from './HighlightText';
import KnowYourProgress from '../../../assets/Images/Know_your_progress.png'
import CompareWithOthers from '../../../assets/Images/Compare_with_others.png'
import PlanYourLessons from '../../../assets/Images/Plan_your_lessons.png'
import CTAButton from './CTAButton';

const LearningLanguageSection = () => {
  return (
    <div>
        <div className="text-4xl font-semibold text-center my-10">
            Your swiss knife for <HighlightText text={'learning any language'}/>
            <div className="text-center text-richblack-700 font-medium lg:w-[75%] mx-auto leading-6 text-base mt-3">
                Using spin making learning multiple languages easy. with 20+
                languages realistic voice-over, progress tracking, custom schedule
                and more.
            </div>
            <div className="flex flex-col lg:flex-row items-center justify-center mt-8 lg:mt-0">
                <img src={KnowYourProgress} alt="" className='lg:-mr-32 object-contain'/>
                <img src={CompareWithOthers} alt="" className=' object-contain lg:-mb-10 lg:-mt-0 -mt-12'/>  
                <img src={PlanYourLessons} alt="" className='lg:-ml-36 lg:-mt-5 -mt-16 object-contain'/>
            </div>
        </div>
        <div className="w-fit mx-auto lg:mb-20 mb-8 -mt-5">
            <CTAButton active={true} linkTo={'/signup'}>Learn More</CTAButton>
        </div>
    </div>
  )
}

export default LearningLanguageSection;
