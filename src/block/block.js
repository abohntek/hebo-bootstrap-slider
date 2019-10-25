/***************************************************************
 *
 *  Copyright notice
 *
 *  (c) 2019 Alexander Bohn <alexander.bohn@hebotek.at>, HeBoTek OG
 *
 *  All rights reserved
 *
 *  This script is free software; you can redistribute it and/or modify
 *  it under the terms of the GNU General Public License as published by
 *  the Free Software Foundation; either version 3 of the License, or
 *  (at your option) any later version.
 *
 *  The GNU General Public License can be found at
 *  http://www.gnu.org/copyleft/gpl.html.
 *
 *  This script is distributed in the hope that it will be useful,
 *  but WITHOUT ANY WARRANTY; without even the implied warranty of
 *  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *  GNU General Public License for more details.
 *
 *  This copyright notice MUST APPEAR in all copies of the script!
 ***************************************************************/

 /**
 * Gutenberg Inclusions
 */
const { __ } = wp.i18n; // Import __() from wp.i18n
const { registerBlockType } = wp.blocks; // Import registerBlockType() from wp.blocks
const { MediaUpload, InspectorControls, URLInputButton } = wp.editor;
const { Fragment } = wp.element;
const { Button } = wp.components;

const ALLOWED_MEDIA_TYPES = [ 'image' ];

/**
 * Defintions of the block attributes
 */
const attributes = {
	id: {
		source: "attribute",
		selector: "carouselGrossmarkt",
		attribute: "id"
	},
	slides: {
		type: 'array',
		default: [],
        source: 'query',
        selector: '.carousel-item',
        query: {
            url: {
                type: 'string',
                source: 'attribute',
				attribute: 'src',
				selector: 'img',
            },
            alt: {
                type: 'string',
                source: 'attribute',
				attribute: 'alt',
				selector: 'img',
				default: '',
			},
			index: {
				type: 'number',
				source: 'attribute',
				attribute: 'data-slide-index'
			},
			slideLink: {
				type: 'string',
				source: 'attribute',
				selector: 'a',
				attribute: 'href',
				default: ''
			}
        }
    }
}

/**
 * Register: aa Gutenberg Block.
 *
 * Registers a new block provided a unique name and an object defining its
 * behavior. Once registered, the block is made editor as an option to any
 * editor interface where blocks are implemented.
 *
 * @link https://wordpress.org/gutenberg/handbook/block-api/
 * @param  {string}   name     Block name.
 * @param  {Object}   settings Block settings.
 * @return {?WPBlock}          The block, if it has been successfully
 *                             registered; otherwise `undefined`.
 */
registerBlockType( 'hebo/bootstrap-slider', {
	title: __( 'Bootstrap Slider' ), // Block title.
	icon: 'images-alt', // Block icon from Dashicons → https://developer.wordpress.org/resource/dashicons/.
	category: 'common', // Block category — Group blocks together based on common traits E.g. common, formatting, layout widgets, embed.
	keywords: [
		__( 'bootstrap-slider' ),
		__( 'Bootstrap Slider' ),
		__( 'HeBo' ),
	],
	attributes,
	/**
	 * The edit function describes the structure of your block in the context of the editor.
	 * This represents what the editor will render when the block is used.
	 *
	 * The "edit" property must be a valid function.
	 *
	 * @link https://wordpress.org/gutenberg/handbook/block-api/block-edit-save/
	 */
	edit({ attributes, className, setAttributes }) {
		const { slides } = attributes;
		const addSlide = () => {
			setAttributes({
				slides: [
					...slides,
					{
						index: slides.length,
						content: ""
					}
				]
			})
		}

		const getImageButton = (openEvent, image) => {
			if(image.url) {
				return (
					<Fragment>
						<span class="hebo__bootstrap-slider-rm-image dashicons dashicons-no" onClick={ () => {
							const newImage = Object.assign({}, image, {
								url: '',
								alt: '',
								slideLink: ''
							});
							setAttributes({
								slides:
								[
									...slides.filter(
										item => item.index != image.index
									),
									newImage
								]
							});
						} }></span>
						<img
							src={ image.url }
							className="hebo__bootstrap-slider-image"
							onClick={ openEvent }
						/>
						<URLInputButton
							url={ image.slideLink }
							onChange={ url => {
								const newImage = Object.assign({}, image, {
									slideLink: url
								})
								setAttributes( {
									slides: [
										...slides
										.filter(item => item.index != image.index),
										newImage
									]
								} )
							} }
						/>
					</Fragment>
				)
			} else {
				return (
					<Fragment>
						<Button isLarge onClick={ openEvent }>{ __('add image', 'hebo-bootstrap-slider') }</Button>
						<Button isLarge onClick={ () => {
							const newImageList = attributes.slides
							.filter(item => item.index != image.index)
							.map(item => {
								if(item.index > image.index) {
									item.index -= 1;
								}
								return item;
							})
							setAttributes({slides: newImageList});
						} }>{ __('remove slide', 'hebo-bootstrap-slider') }</Button>
					</Fragment>
				)
			}
		}

		const logoList = slides
		.sort((a, b) => a.index - b.index)
		.map(image => {
			return (
				<div className="hebo__bootstrap-slider-block">
					<div className="hebo__bootstrap-slider-slide">
						<MediaUpload
							onSelect = { media => {
								const newImage = Object.assign({}, image, {
									url: media.url,
									alt: media.alt
								})
								setAttributes({
									slides: [
										...slides
										.filter(item => item.index != image.index),
										newImage
									]
								})
							} }
							type = "image"
							allowedTypes={ ALLOWED_MEDIA_TYPES }
							value = { image.url }
							render = { ( { open } ) => getImageButton(open, image) }
						/>
					</div>
				</div>
			)
		});

		return (
			<div className= { className }>
				{ logoList }
				<div className="hebo__bootstrap-slider-block">
					<span class="hebo__bootstrap-slider-add-slide dashicons dashicons-plus-alt" onClick={ () => addSlide() }></span>
				</div>
			</div>
		)

	},

	/**
	 * The save function defines the way in which the different attributes should be combined
	 * into the final markup, which is then serialized by Gutenberg into post_content.
	 *
	 * The "save" property must be specified and must be a valid function.
	 *
	 * @link https://wordpress.org/gutenberg/handbook/block-api/block-edit-save/
	 */
	save({ attributes }) {
		const logoMarkup = (slide) => {
			if(slide.slideLink) {
				return(
					<a href={ slide.slideLink } target="_blank" rel="noopener noreferrer">
						<img src={ slide.url } alt={ slide.alt } />
					</a>
				)
			} else {
				return(
					<img src={slide.url} alt={slide.alt} />
				)
			}
		};
		const { slides, id } = attributes;
		const slideList = slides
		.map(
			slide => {
				return (
					<div className={ slide.index == 0 ? "carousel-item active" : "carousel-item" } data-slide-index={ slide.index }>
						{ logoMarkup(slide) }
					</div>
				)
			}
		);
		return (
			<div class="carousel slide" data-ride="carousel" id="carouselGrossmarkt" >
				<div className="carousel-inner">
					{ slideList }
				</div>
				<a class="carousel-control-prev" href="#carouselGrossmarkt" role="button" data-slide="prev">
					<span class="carousel-control-prev-icon" aria-hidden="true"></span>
					<span class="sr-only">Previous</span>
				</a>
				<a class="carousel-control-next" href="#carouselGrossmarkt" role="button" data-slide="next">
					<span class="carousel-control-next-icon" aria-hidden="true"></span>
					<span class="sr-only">Next</span>
				</a>
			</div>
		);
	},
} );
